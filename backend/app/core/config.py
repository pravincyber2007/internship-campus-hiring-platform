import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "postgresql://postgres:your_password@localhost:5432/campus_internship_db"
    )
    PROJECT_NAME: str = "Campus Internship Portal API"

    class Config:
        env_file = ".env"

settings = Settings()