from fastapi import FastAPI
from app.core.database import engine, Base

# 1. Import all your modular API routers
from app.api import auth, admin, student, company, internship, applications

# Automatically create database tables if they don't exist
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Campus Internship Portal API",
    description="Backend API for managing campus internships, student tracking via college code 3807, and applications.",
    version="1.0.0"
)

# 2. Register every router into the FastAPI app instance
app.include_router(auth.router)
app.include_router(admin.router)
app.include_router(student.router)
app.include_router(company.router)
app.include_router(internship.router)
app.include_router(applications.router)

@app.get("/")
def root():
    return {"message": "Campus Internship Portal Backend is running successfully!"}