import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str
    PROJECT_NAME: str = "Campus Internship Portal API"

    class Config:
        env_file = ".env"
        env_ignore_empty = True

settings = Settings()