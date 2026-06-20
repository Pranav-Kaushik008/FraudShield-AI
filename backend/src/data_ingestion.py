import pandas as pd

INPUT_PATH = "data/raw/creditcard.csv"

OUTPUT_PATH = "data/processed/cleaned_data.csv"


def ingest_data():

    df = pd.read_csv(INPUT_PATH)

    df.drop_duplicates(inplace=True)

    df.to_csv(
        OUTPUT_PATH,
        index=False
    )

    print("Data Ingestion Completed")


if __name__ == "__main__":

    ingest_data()