from fastapi import FastAPI, UploadFile, File, Query, HTTPException, Depends
from api.schemas import Transaction
from api.predict import make_prediction, make_predictions_batch
from database.database import engine
from database.models import Base
from fastapi.middleware.cors import CORSMiddleware
from src.explainability import explain_prediction
from sqlalchemy import func
from database.database import SessionLocal
from database.models import PredictionLog
import pandas as pd
from typing import Optional

Base.metadata.create_all(bind=engine)

app = FastAPI(title="FraudShield AI")

# Allow all origins to support Docker networking, Vercel, local dev, and Render deployments
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get("/")
def home():
    return {"message": "FraudShield AI Running"}

@app.post("/explain")
def explain(transaction: Transaction):
    return explain_prediction(transaction.model_dump())

@app.get("/analytics")
def analytics():
    db = SessionLocal()
    try:
        total = db.query(PredictionLog).count()
        fraud = db.query(PredictionLog).filter(PredictionLog.prediction == 1).count()
        legitimate = total - fraud
        fraud_rate = 0
        if total > 0:
            fraud_rate = round(fraud / total * 100, 2)
        return {"total": total, "fraud": fraud, "legitimate": legitimate, "fraud_rate": fraud_rate}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()

@app.post("/upload-csv")
async def upload_csv(file: UploadFile = File(...)):
    try:
        df = pd.read_csv(file.file)
        results = make_predictions_batch(df)
        fraud_count = sum(1 for r in results if r["prediction"] == 1)
        return {"total_rows": len(df), "fraud_count": fraud_count, "results": results}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to process CSV file: {str(e)}")

@app.post("/predict")
def predict(transaction: Transaction):
    try:
        return make_prediction(transaction)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/history")
def get_history(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    prediction: Optional[int] = Query(None),
    min_amount: Optional[float] = Query(None),
    max_amount: Optional[float] = Query(None),
    sort_by: str = Query("created_at"),
    sort_order: str = Query("desc")
):
    db = SessionLocal()
    try:
        query = db.query(PredictionLog)
        
        # Filtering
        if prediction is not None:
            query = query.filter(PredictionLog.prediction == prediction)
        if min_amount is not None:
            query = query.filter(PredictionLog.amount >= min_amount)
        if max_amount is not None:
            query = query.filter(PredictionLog.amount <= max_amount)
            
        # Sorting
        sort_attr = getattr(PredictionLog, sort_by, PredictionLog.created_at)
        if sort_order.lower() == "desc":
            query = query.order_by(sort_attr.desc())
        else:
            query = query.order_by(sort_attr.asc())
            
        total = query.count()
        results = query.offset((page - 1) * limit).limit(limit).all()
        
        return {
            "total": total,
            "page": page,
            "limit": limit,
            "pages": (total + limit - 1) // limit,
            "results": [
                {
                    "id": item.id,
                    "amount": item.amount,
                    "prediction": item.prediction,
                    "fraud_probability": item.fraud_probability,
                    "created_at": item.created_at.isoformat() if item.created_at else None
                }
                for item in results
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()

@app.get("/fraud-distribution")
def get_fraud_distribution():
    db = SessionLocal()
    try:
        total = db.query(PredictionLog).count()
        fraud = db.query(PredictionLog).filter(PredictionLog.prediction == 1).count()
        legitimate = total - fraud
        return [
            {"name": "Legitimate", "value": legitimate},
            {"name": "Fraud", "value": fraud}
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()

@app.get("/recent-transactions")
def get_recent_transactions(limit: int = Query(10, ge=1, le=100)):
    db = SessionLocal()
    try:
        results = db.query(PredictionLog).order_by(PredictionLog.created_at.desc()).limit(limit).all()
        return [
            {
                "id": item.id,
                "amount": item.amount,
                "prediction": item.prediction,
                "fraud_probability": item.fraud_probability,
                "created_at": item.created_at.isoformat() if item.created_at else None
            }
            for item in results
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()

@app.get("/daily-trend")
def get_daily_trend():
    db = SessionLocal()
    try:
        trend_query = db.query(
            func.date(PredictionLog.created_at).label("date"),
            func.count(PredictionLog.id).label("total"),
            func.sum(PredictionLog.prediction).label("fraud")
        ).group_by(
            func.date(PredictionLog.created_at)
        ).order_by(
            func.date(PredictionLog.created_at).asc()
        ).all()
        
        return [
            {
                "date": str(row.date),
                "total": row.total,
                "fraud": int(row.fraud or 0),
                "legitimate": row.total - int(row.fraud or 0)
            }
            for row in trend_query
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()

@app.get("/dashboard")
def dashboard_stats():
    db = SessionLocal()
    try:
        total_transactions = db.query(PredictionLog).count()
        fraud_transactions = db.query(PredictionLog).filter(PredictionLog.prediction == 1).count()
        avg_amount = db.query(func.avg(PredictionLog.amount)).scalar()
        fraud_rate = 0
        if total_transactions > 0:
            fraud_rate = round((fraud_transactions / total_transactions) * 100, 2)
            
        # Include distribution and recent transactions to optimize queries
        legitimate = total_transactions - fraud_transactions
        fraud_distribution = [
            {"name": "Legitimate", "value": legitimate},
            {"name": "Fraud", "fraud": fraud_transactions}
        ]
        
        return {
            "total_transactions": total_transactions,
            "fraud_transactions": fraud_transactions,
            "fraud_rate": fraud_rate,
            "average_amount": round(avg_amount or 0, 2)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()