import pandas as pd

from api.schemas import Transaction

from src.utils import load_object

from database.database import SessionLocal

from database.models import PredictionLog


MODEL_PATH = "models/fraud_model.pkl"

SCALER_PATH = "models/scaler.pkl"


model = load_object(MODEL_PATH)

scaler = load_object(SCALER_PATH)


def make_prediction(transaction: Transaction):
    data = pd.DataFrame([transaction.model_dump()])
    scaled_data = scaler.transform(data)
    prediction = model.predict(scaled_data)
    probability = model.predict_proba(scaled_data)
    
    db = SessionLocal()
    try:
        log = PredictionLog(
            amount=float(data["Amount"][0]),
            prediction=int(prediction[0]),
            fraud_probability=float(probability[0][1])
        )
        db.add(log)
        db.commit()
    except Exception as e:
        db.rollback()
        raise e
    finally:
        db.close()
        
    return {
        "prediction": int(prediction[0]),
        "fraud_probability": round(float(probability[0][1]), 4)
    }


def make_predictions_batch(transactions_df: pd.DataFrame):
    cols = list(Transaction.model_fields.keys())
    
    # Verify that all columns exist
    missing_cols = [c for c in cols if c not in transactions_df.columns]
    if missing_cols:
        raise ValueError(f"Missing required columns in CSV: {missing_cols}")
        
    df_ordered = transactions_df[cols]
    scaled_data = scaler.transform(df_ordered)
    predictions = model.predict(scaled_data)
    probabilities = model.predict_proba(scaled_data)[:, 1]
    
    db = SessionLocal()
    try:
        logs = []
        for i in range(len(transactions_df)):
            log = PredictionLog(
                amount=float(df_ordered.iloc[i]["Amount"]),
                prediction=int(predictions[i]),
                fraud_probability=float(probabilities[i])
            )
            logs.append(log)
        
        db.bulk_save_objects(logs)
        db.commit()
    except Exception as e:
        db.rollback()
        raise e
    finally:
        db.close()
        
    results = []
    for i in range(len(predictions)):
        results.append({
            "prediction": int(predictions[i]),
            "fraud_probability": round(float(probabilities[i]), 4)
        })
    return results