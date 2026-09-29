from typing import Literal

from pydantic import BaseModel, EmailStr, Field


class SignupRequest(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    password: str = Field(min_length=6, max_length=128)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class HousePredictRequest(BaseModel):
    type: Literal["house"]
    city: str
    property_type: str
    bedrooms: int
    toilets: int
    property_age: str
    area_sqft: float
    transaction: str
    floor: int


class LandPredictRequest(BaseModel):
    type: Literal["land"]
    location: str
    zone: str
    area_sqft: float
    road_facing: str
    distance_to_city: str


class PredictResponse(BaseModel):
    predicted_price: float
    price_range: dict
    confidence_score: float
    market_trend: str
    location: str
    top_factors: list[dict]


class RecommendRequest(BaseModel):
    city: str
    budget: float
    area: float
