from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, r2_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder

BASE_DIR = Path(__file__).resolve().parents[2]
DATA_DIR = BASE_DIR / "data"
MODEL_DIR = BASE_DIR / "models"
MODEL_DIR.mkdir(exist_ok=True)


def _build_pipeline(cat_cols: list[str], num_cols: list[str]) -> Pipeline:
    preprocessor = ColumnTransformer(
        transformers=[
            ("cat", OneHotEncoder(handle_unknown="ignore"), cat_cols),
            ("num", "passthrough", num_cols),
        ]
    )
    return Pipeline(
        steps=[
            ("preprocessor", preprocessor),
            (
                "model",
                RandomForestRegressor(
                    n_estimators=300,
                    max_depth=16,
                    random_state=42,
                    n_jobs=-1,
                ),
            ),
        ]
    )


def train_house_model() -> dict:
    df = pd.read_csv(DATA_DIR / "house_data.csv")
    df = df.dropna()
    target = "price"
    features = [
        "city",
        "property_type",
        "bedrooms",
        "toilets",
        "property_age",
        "area_sqft",
        "transaction",
        "floor",
    ]
    cat_cols = ["city", "property_type", "property_age", "transaction"]
    num_cols = ["bedrooms", "toilets", "area_sqft", "floor"]

    X_train, X_test, y_train, y_test = train_test_split(
        df[features], df[target], test_size=0.2, random_state=42
    )
    pipe = _build_pipeline(cat_cols, num_cols)
    pipe.fit(X_train, y_train)
    preds = pipe.predict(X_test)
    artifact = {
        "pipeline": pipe,
        "features": features,
        "cat_cols": cat_cols,
        "num_cols": num_cols,
        "r2": float(r2_score(y_test, preds)),
        "mae": float(mean_absolute_error(y_test, preds)),
    }
    joblib.dump(artifact, MODEL_DIR / "house_model.pkl")
    return artifact


def train_land_model() -> dict:
    df = pd.read_csv(DATA_DIR / "land_data.csv")
    df = df.dropna()
    target = "price"
    features = ["location", "zone", "area_sqft", "road_facing", "distance_to_city"]
    cat_cols = ["location", "zone", "road_facing", "distance_to_city"]
    num_cols = ["area_sqft"]

    X_train, X_test, y_train, y_test = train_test_split(
        df[features], df[target], test_size=0.2, random_state=42
    )
    pipe = _build_pipeline(cat_cols, num_cols)
    pipe.fit(X_train, y_train)
    preds = pipe.predict(X_test)
    artifact = {
        "pipeline": pipe,
        "features": features,
        "cat_cols": cat_cols,
        "num_cols": num_cols,
        "r2": float(r2_score(y_test, preds)),
        "mae": float(mean_absolute_error(y_test, preds)),
    }
    joblib.dump(artifact, MODEL_DIR / "land_model.pkl")
    return artifact


def ensure_models():
    if not (MODEL_DIR / "house_model.pkl").exists():
        train_house_model()
    if not (MODEL_DIR / "land_model.pkl").exists():
        train_land_model()


def _top_factors(artifact: dict, payload_df: pd.DataFrame) -> list[dict]:
    preprocessor = artifact["pipeline"].named_steps["preprocessor"]
    model = artifact["pipeline"].named_steps["model"]
    feature_names = preprocessor.get_feature_names_out()
    importances = model.feature_importances_
    pairs = sorted(zip(feature_names, importances), key=lambda x: x[1], reverse=True)[:5]
    return [{"feature": f, "importance": round(float(i), 4)} for f, i in pairs]


def predict_house(payload: dict) -> dict:
    artifact = joblib.load(MODEL_DIR / "house_model.pkl")
    X = pd.DataFrame([payload], columns=artifact["features"])
    predicted = float(artifact["pipeline"].predict(X)[0])
    spread = 0.07
    confidence = max(0.6, min(0.98, artifact["r2"]))
    trend = "+8%" if payload.get("transaction", "").lower() == "sale" else "+5%"
    return {
        "predicted_price": round(predicted, 2),
        "price_range": {
            "min": round(predicted * (1 - spread), 2),
            "max": round(predicted * (1 + spread), 2),
        },
        "confidence_score": round(confidence, 2),
        "market_trend": trend,
        "location": payload["city"],
        "top_factors": _top_factors(artifact, X),
    }


def predict_land(payload: dict) -> dict:
    artifact = joblib.load(MODEL_DIR / "land_model.pkl")
    X = pd.DataFrame([payload], columns=artifact["features"])
    predicted = float(artifact["pipeline"].predict(X)[0])
    spread = 0.09
    confidence = max(0.55, min(0.97, artifact["r2"]))
    trend = "+6%"
    return {
        "predicted_price": round(predicted, 2),
        "price_range": {
            "min": round(predicted * (1 - spread), 2),
            "max": round(predicted * (1 + spread), 2),
        },
        "confidence_score": round(confidence, 2),
        "market_trend": trend,
        "location": payload["location"],
        "top_factors": _top_factors(artifact, X),
    }
