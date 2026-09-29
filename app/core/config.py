from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    mongodb_uri: str = "mongodb://localhost:27017"
    mongodb_db: str = "estateiq"
    jwt_secret: str = "change-this-secret"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 1440

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


settings = Settings()
