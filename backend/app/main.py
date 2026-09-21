from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, student, internship, admin, applications, profiles, company

app = FastAPI(title="Campus Internship Platform API", version="1.0.0")

# Explicitly allow your frontend domains and local development environments
origins = [
    "https://internship-campus-hiring-platform-1.onrender.com",
    "https://internship-campus-hiring-platform.onrender.com",
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register all API routers with correct prefixes
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(student.router, prefix="/api", tags=["Student Portal"])
app.include_router(internship.router, prefix="/api", tags=["Internships"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])
app.include_router(applications.router, prefix="/api/applications", tags=["Applications"])
app.include_router(profiles.router, prefix="/api/profiles", tags=["Profiles"])
app.include_router(company.router, prefix="/api", tags=["Company Portal"])

@app.get("/")
def read_root():
    return {"message": "Campus Internship Platform Backend is Live!"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}