# EstateIQ Backend + ML (FastAPI)

Production-style backend for real estate prediction with:
- JWT auth (`/auth/signup`, `/auth/login`)
- ML predictions (`/predict`) for house and land
- Trend data (`/price-trend`)
- Property listings (`/properties`)
- Recommendations (`/recommend`)

## 1) Setup

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
```

Ensure MongoDB is running locally at `mongodb://localhost:27017`.

## 2) Train models

```bash
python -m app.ml.train
```

This creates:
- `models/house_model.pkl`
- `models/land_model.pkl`

## 3) Run API

```bash
uvicorn app.main:app --reload
```

Open Swagger docs at:
- `http://127.0.0.1:8000/docs`

## 4) API flow

1. `POST /auth/signup`
2. `POST /auth/login` (get JWT)
3. Use JWT in `Authorization: Bearer <token>`
4. Call:
   - `POST /predict`
   - `GET /price-trend?location=Chennai`
   - `GET /properties`
   - `POST /recommend`

## 5) Example prediction payloads

House:
```json
{
  "type": "house",
  "city": "Chennai",
  "property_type": "Apartment",
  "bedrooms": 3,
  "toilets": 2,
  "property_age": "0-2 years",
  "area_sqft": 1200,
  "transaction": "Sale",
  "floor": 2
}
```

Land:
```json
{
  "type": "land",
  "location": "Coimbatore",
  "zone": "Residential",
  "area_sqft": 2400,
  "road_facing": "East",
  "distance_to_city": "0-5 km"
}
```
