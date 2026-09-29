from pymongo import MongoClient

from app.core.config import settings

client = MongoClient(settings.mongodb_uri)
db = client[settings.mongodb_db]


def users_collection():
    return db["users"]


def properties_collection():
    return db["properties"]


def predictions_collection():
    return db["prediction_history"]
