from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.application import Application
from app.models.internship import Internship
from app.models.company import CompanyProfile
from pydantic import BaseModel

router = APIRouter(tags=["Applications"])

class ApplicationCreate(BaseModel):
    student_id: int
    internship_id: int

@router.post("")
@router.post("/")
def apply_internship(payload: ApplicationCreate, db: Session = Depends(get_db)):
    # Check if already applied
    existing_app = db.query(Application).filter(
        Application.student_id == payload.student_id,
        Application.internship_id == payload.internship_id
    ).first()
    
    if existing_app:
        raise HTTPException(status_code=400, detail="You have already applied for this internship")

    new_application = Application(
        student_id=payload.student_id,
        internship_id=payload.internship_id,
        status="applied"
    )
    db.add(new_application)
    db.commit()
    db.refresh(new_application)
    return {"message": "Applied successfully", "application_id": new_application.application_id}

@router.get("/tracker/{student_id}")
def get_student_tracker(student_id: int, db: Session = Depends(get_db)):
    applications = db.query(Application).filter(Application.student_id == student_id).all()
    tracker_data = []
    for app in applications:
        internship = db.query(Internship).filter(Internship.internship_id == app.internship_id).first()
        company = db.query(CompanyProfile).filter(CompanyProfile.profile_id == internship.company_id).first() if internship else None
        
        tracker_data.append({
            "application_id": app.application_id,
            "title": internship.title if internship else "N/A",
            "company_name": company.name if company else "N/A",
            "domain": internship.domain if internship else "N/A",
            "stipend": internship.stipend if internship else 0,
            "status": app.status
        })
    return tracker_data