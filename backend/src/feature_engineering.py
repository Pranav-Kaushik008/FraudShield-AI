import pandas as pd

from sklearn.model_selection import train_test_split

from sklearn.preprocessing import StandardScaler

from imblearn.over_sampling import SMOTE


INPUT_PATH = "data/processed/cleaned_data.csv"


def feature_engineering():

    df = pd.read_csv(INPUT_PATH)

    X = df.drop("Class", axis=1)

    y = df["Class"]

    X_train, X_test, y_train, y_test = train_test_split(

        X,

        y,

        test_size=0.2,

        random_state=42,

        stratify=y

    )

    scaler = StandardScaler()

    X_train_scaled = scaler.fit_transform(X_train)

    X_test_scaled = scaler.transform(X_test)

    smote = SMOTE(random_state=42)

    X_train_balanced, y_train_balanced = smote.fit_resample(

        X_train_scaled,

        y_train

    )

    return (

        X_train_balanced,

        X_test_scaled,

        y_train_balanced,

        y_test,

        scaler

    )


if __name__ == "__main__":

    output = feature_engineering()

    print("Feature Engineering Completed")

    print(output[0].shape)