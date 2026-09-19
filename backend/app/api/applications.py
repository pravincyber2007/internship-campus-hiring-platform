from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.application import Application
from app.models.student import StudentProfile
from app.models.internship import Internship
from app.models.company import CompanyProfile
from pydantic import BaseModel

router = APIRouter(prefix="/applications", tags=["Applications"])

class ApplicationCreate(BaseModel):
    student_id: int
    internship_id: int

class StatusUpdate(BaseModel):
    status: str

@router.post("/")
def apply_internship(payload: ApplicationCreate, db: Session = Depends(get_db)):
    existing = db.query(Application).filter(
        Application.student_id == payload.student_id,
        Application.internship_id == payload.internship_id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="You have already applied for this internship.")

    new_app = Application(
        student_id=payload.student_id,
        internship_id=payload.internship_id,
        status="Applied"
    )
    db.add(new_app)
    db.commit()
    db.refresh(new_app)
    return {"message": "Successfully applied for internship", "application_id": new_app.application_id}

@router.put("/{application_id}/status")
def update_application_status(application_id: int, payload: StatusUpdate, db: Session = Depends(get_db)):
    app = db.query(Application).filter(Application.application_id == application_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    
    app.status = payload.status
    db.commit()
    return {"message": "Application status updated successfully"}

@router.get("/student/{student_id}")
def get_student_applications(student_id: int, db: Session = Depends(get_db)):
    apps = db.query(Application).filter(Application.student_id == student_id).all()
    results = []
    for app in apps:
        internship = db.query(Internship).filter(Internship.internship_id == app.internship_id).first()
        company = db.query(CompanyProfile).filter(CompanyProfile.profile_id == internship.company_id).first() if internship else None
        results.append({
            "application_id": app.application_id,
            "internship_id": app.internship_id,
            "internship_title": internship.title if internship else "Unknown Position",
            "company_name": company.name if company else "Unknown Company",
            "domain": internship.domain if internship else "N/A",
            "status": app.status,
            "applied_date": str(app.applied_date)
        })
    return results

@router.get("/internship/{internship_id}/applicants")
def get_internship_applicants(internship_id: int, db: Session = Depends(get_db)):
    apps = db.query(Application).filter(Application.internship_id == internship_id).all()
    results = []
    for app in apps:
        student = db.query(StudentProfile).filter(StudentProfile.profile_id == app.student_id).first()
        results.append({
            "application_id": app.application_id,
            "status": app.status,
            "applied_date": str(app.applied_date),
            "student": student
        })
    return results