from fastapi import APIRouter, Depends, Query

from app.api.deps import get_current_user
from app.db.mongo import properties_collection
from app.models import RecommendRequest

router = APIRouter(tags=["market"])


@router.get("/price-trend")
def price_trend(location: str = Query(...), current_user: dict = Depends(get_current_user)):
    docs = list(properties_collection().find({"city": location}))
    if not docs:
        base = 5000000
    else:
        base = sum(d.get("price", 0) for d in docs) / max(len(docs), 1)
    months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
    prices = [round(base * (1 + i * 0.02), 2) for i in range(len(months))]
    return {"dates": months, "prices": prices}


@router.get("/properties")
def get_properties(current_user: dict = Depends(get_current_user)):
    docs = list(properties_collection().find({}, {"_id": 0}))
    return docs


@router.post("/recommend")
def recommend(payload: RecommendRequest, current_user: dict = Depends(get_current_user)):
    min_price = payload.budget * 0.8
    max_price = payload.budget * 1.2
    min_area = payload.area * 0.8
    max_area = payload.area * 1.2

    query = {
        "city": payload.city,
        "price": {"$gte": min_price, "$lte": max_price},
        "area": {"$gte": min_area, "$lte": max_area},
    }
    docs = list(
        properties_collection().find(
            query, {"_id": 0, "city": 1, "price": 1, "area": 1, "category": 1, "type": 1}
        )
    )
    return docs
