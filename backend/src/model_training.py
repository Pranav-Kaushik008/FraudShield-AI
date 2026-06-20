from sklearn.metrics import classification_report

from xgboost import XGBClassifier

from feature_engineering import feature_engineering

from utils import save_object


MODEL_PATH = "models/fraud_model.pkl"

SCALER_PATH = "models/scaler.pkl"


def train_model():

    (

        X_train,

        X_test,

        y_train,

        y_test,

        scaler

    ) = feature_engineering()

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

    print(

        classification_report(

            y_test,

            predictions

        )

    )

    save_object(

        MODEL_PATH,

        model

    )

    save_object(

        SCALER_PATH,

        scaler

    )


if __name__ == "__main__":

    train_model()