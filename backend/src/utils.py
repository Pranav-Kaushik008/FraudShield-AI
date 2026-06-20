import joblib


def save_object(path, obj):

    joblib.dump(obj, path)

    print(f"Saved: {path}")


def load_object(path):

    return joblib.load(path)