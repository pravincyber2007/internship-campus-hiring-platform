from fastapi import FastAPI
from app.core.database import engine, Base

from app.models import Admin
from app.models import Student
from app.models import Internship
from app.models import Company
from app.models import Application


from app.api.students import router as student_router

Base.metadata.create_all(bind=engine)
app=FastAPI()
app.include_router(student_router)
@app.get("/")
def home():
    return {"message":"sever is running and all database tables are created!"}


#company routing:
from app.api.companies import router as company_router
app.include_router(company_router)

#internship routing :
from app.api.internships import router as internship_router
app.include_router(internship_router)


from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)