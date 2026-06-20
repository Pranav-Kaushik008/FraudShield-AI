import mlflow

from xgboost import XGBClassifier

from sklearn.metrics import f1_score

from feature_engineering import feature_engineering

import pandas as pd

def train_mlflow():

    X_train, X_test, y_train, y_test, scaler = feature_engineering()

    mlflow.set_experiment("FraudShield_AI")

    with mlflow.start_run():

        model = XGBClassifier(

            n_estimators=300,

            max_depth=6,

            learning_rate=0.05,

            random_state=42,

            eval_metric="logloss"

        )

        model.fit(

            X_train,

            y_train

        )

        predictions = model.predict(

            X_test

        )

        score = f1_score(

            y_test,

            predictions

        )

        mlflow.log_metric(

            "f1_score",

            score

        )

        mlflow.log_param(

            "n_estimators",

            300

        )

        mlflow.log_param(

            "max_depth",

            6

        )

        mlflow.log_param(

            "learning_rate",

            0.05

        )

        sample_input = pd.DataFrame(
    X_test[:5]
)

        mlflow.sklearn.log_model(
            sk_model=model,
            name="fraud_model",
            input_example=sample_input
       )

        print(

            "Run completed"

        )


if __name__ == "__main__":

    train_mlflow()