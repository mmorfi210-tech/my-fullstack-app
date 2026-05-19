from pydantic_settings import BaseSettings
from pydantic import ConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "Full-Stack App API"
    DATABASE_URL: str = "postgresql://postgres:postgres@db:5432/postgres"
    SECRET_KEY: str = "super_secret_signing_key_keep_it_secure_12345"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    model_config = ConfigDict(env_file=".env", case_sensitive=True)

settings = Settings()
