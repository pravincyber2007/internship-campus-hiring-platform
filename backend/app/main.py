from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import engine, Base
from app.api import auth, student, internship, admin, applications, profiles

# Automatically create all database tables in PostgreSQL on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Campus Internship Platform API", version="1.0.0")

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows requests from any frontend domain (like your Vercel app)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all feature routers
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(student.router, prefix="/api/student", tags=["Student"])
app.include_router(internship.router, prefix="/api/internship", tags=["Internship"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])
app.include_router(applications.router, prefix="/api/applications", tags=["Applications"])
app.include_router(profiles.router, prefix="/api/profiles", tags=["Profiles"])

@app.get("/")
def read_root():
    return {"message": "Campus Internship Platform Backend is Live!"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}