from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, student, internship, admin, applications, profiles, company
from app.core.database import engine, Base

# This automatically creates your tables (users, companies, internships, etc.) in your cloud database if they don't exist yet
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Campus Internship Platform API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(student.router, prefix="/api/student", tags=["Student"])
app.include_router(internship.router, prefix="/api", tags=["Internship"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])
app.include_router(applications.router, prefix="/api/applications", tags=["Applications"])
app.include_router(profiles.router, prefix="/api/profiles", tags=["Profiles"])
app.include_router(company.router, prefix="/api/company", tags=["Company"])

@app.get("/")
def read_root():
    return {"message": "Campus Internship Platform Backend is Live!"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}