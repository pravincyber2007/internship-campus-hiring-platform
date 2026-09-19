from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, student, internship, admin, applications, profiles

app = FastAPI(title="Internship Campus Hiring Platform")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(student.router)
app.include_router(internship.router)
app.include_router(admin.router)
app.include_router(applications.router)
app.include_router(profiles.router)

@app.get("/")
def read_root():
    return {"message": "CampusHire API is running successfully"}