from datetime import datetime, timezone
from typing import Union

from fastapi import APIRouter, Depends

from app.api.deps import get_current_user
from app.db.mongo import predictions_collection
from app.ml.model_service import ensure_models, predict_house, predict_land
from app.models import HousePredictRequest, LandPredictRequest, PredictResponse

router = APIRouter(tags=["prediction"])
PredictRequest = Union[HousePredictRequest, LandPredictRequest]


@router.post("/predict", response_model=PredictResponse)
def predict(payload: PredictRequest, current_user: dict = Depends(get_current_user)):
    ensure_models()
    payload_data = payload.model_dump()
    if payload_data["type"] == "house":
        result = predict_house(payload_data)
    else:
        result = predict_land(payload_data)

    predictions_collection().insert_one(
        {
            "user_id": current_user["_id"],
            "input": payload_data,
            "output": result,
            "created_at": datetime.now(timezone.utc),
        }
    )
    return result
