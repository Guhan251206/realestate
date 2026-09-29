from fastapi import APIRouter, HTTPException, status

from app.core.security import create_access_token, hash_password, verify_password
from app.db.mongo import users_collection
from app.models import LoginRequest, SignupRequest, TokenResponse

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/signup", status_code=status.HTTP_201_CREATED)
def signup(payload: SignupRequest):
    coll = users_collection()
    existing = coll.find_one({"email": payload.email})
    if existing:
        raise HTTPException(status_code=409, detail="Email already registered")
    doc = {
        "name": payload.name,
        "email": payload.email,
        "password": hash_password(payload.password),
    }
    coll.insert_one(doc)
    return {"message": "User created successfully"}


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest):
    user = users_collection().find_one({"email": payload.email})
    if not user or not verify_password(payload.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token(payload.email)
    return TokenResponse(access_token=token)
