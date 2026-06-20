import pandas as pd
import matplotlib.pyplot as plt

DATA_PATH = "../data/raw/creditcard.csv"

df = pd.read_csv(DATA_PATH)

print("\nDataset Shape")
print(df.shape)

print("\nDataset Columns")
print(df.columns)

print("\nMissing Values")
print(df.isnull().sum())

print("\nFraud Distribution")

fraud_counts = df["Class"].value_counts()

print(fraud_counts)

fraud_counts.plot(
    kind="bar"
)

plt.title("Fraud vs Non-Fraud")

plt.xlabel("Class")

plt.ylabel("Count")

plt.show()