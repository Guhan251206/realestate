from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response

from app.api.auth import router as auth_router
from app.api.market import router as market_router
from app.api.predict import router as predict_router
from app.db.mongo import properties_collection
from app.ml.model_service import ensure_models


def seed_properties():
    coll = properties_collection()
    if coll.count_documents({}) > 0:
        return
    coll.insert_many(
        [
            {
                "type": "sale",
                "category": "house",
                "city": "Chennai",
                "price": 12000000,
                "area": 1200,
                "bedrooms": 3,
            },
            {
                "type": "sale",
                "category": "house",
                "city": "Coimbatore",
                "price": 7800000,
                "area": 1150,
                "bedrooms": 2,
            },
            {
                "type": "rent",
                "category": "house",
                "city": "Chennai",
                "price": 35000,
                "area": 900,
                "bedrooms": 2,
            },
            {
                "type": "sale",
                "category": "land",
                "city": "Madurai",
                "price": 6500000,
                "area": 2400,
                "bedrooms": 0,
            },
        ]
    )


@asynccontextmanager
async def lifespan(app: FastAPI):
    ensure_models()
    seed_properties()
    yield


app = FastAPI(title="EstateIQ Backend", version="1.0.0", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(auth_router)
app.include_router(predict_router)
app.include_router(market_router)


@app.get("/")
def root():
    return {"message": "EstateIQ API is running"}


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/favicon.ico", include_in_schema=False)
def favicon():
    return Response(status_code=204)
