import pandas as pd
import shap

from src.utils import load_object

MODEL_PATH = "models/fraud_model.pkl"

SCALER_PATH = "models/scaler.pkl"

model = load_object(MODEL_PATH)

scaler = load_object(SCALER_PATH)


def explain_prediction(data_dict):

    df = pd.DataFrame([data_dict])

    scaled_data = scaler.transform(df)

    explainer = shap.TreeExplainer(model)

    shap_values = explainer.shap_values(scaled_data)

    feature_names = df.columns.tolist()

    scores = []

    for index, feature in enumerate(feature_names):

        scores.append({

            "feature": feature,

            "impact": round(

                float(abs(shap_values[0][index])),

                4

            )

        })

    scores.sort(

        key=lambda x: x["impact"],

        reverse=True

    )

    return scores[:5]