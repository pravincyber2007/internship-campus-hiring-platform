from fastapi import FastAPI
from app.core.database import engine, Base

# Import enterprise models to register metadata
import app.models.user
import app.models.student_profile
import app.models.company_profile
import app.models.admin_profile
import app.models.internship
import app.models.application

app = FastAPI(title="Campus Placement API - DB Setup")

@app.get("/")
def home():
    return {"message": "Database-first setup active"}

@app.on_event("startup")
def startup_db_client():
    Base.metadata.create_all(bind=engine)