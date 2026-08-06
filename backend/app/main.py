from fastapi import FastAPI
from app.core.database import engine, Base

from app.models import Admin
from app.models import Student
from app.models import Internship
from app.models import Company
from app.models import Application


Base.metadata.create_all(bind=engine)
app=FastAPI()
@app.get("/")
def home():
    return {"message":"sever is running and all database tables are created!"}
