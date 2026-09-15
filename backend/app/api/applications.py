from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.application import Application
from app.models.student import StudentProfile
from app.models.internship import Internship
from app.schemas.application_schema import ApplicationCreate, ApplicationResponse, ApplicationUpdateStatus

router = APIRouter(prefix="/applications", tags=["Applications"])

@router.post("/", response_model=ApplicationResponse)
def apply_for_internship(application: ApplicationCreate, db: Session = Depends(get_db)):
    # Verify that the student profile exists
    student = db.query(StudentProfile).filter(StudentProfile.profile_id == application.student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found")
        
    # Verify that the internship exists
    internship = db.query(Internship).filter(Internship.internship_id == application.internship_id).first()
    if not internship:
        raise HTTPException(status_code=404, detail="Internship listing not found")
        
    # Check if student already applied for this internship
    existing_app = db.query(Application).filter(
        Application.student_id == application.student_id,
        Application.internship_id == application.internship_id
    ).first()
    
    if existing_app:
        raise HTTPException(status_code=400, detail="You have already applied for this internship")
        
    new_application = Application(
        student_id=application.student_id,
        internship_id=application.internship_id,
        status="Applied"
    )
    
    db.add(new_application)
    db.commit()
    db.refresh(new_application)
    return new_application

@router.get("/student/{student_id}", response_model=List[ApplicationResponse])
def get_student_applications(student_id: int, db: Session = Depends(get_db)):
    # Allows students to track their application progress
    applications = db.query(Application).filter(Application.student_id == student_id).all()
    return applications

@router.patch("/{application_id}/status", response_model=ApplicationResponse)
def update_application_status(application_id: int, payload: ApplicationUpdateStatus, db: Session = Depends(get_db)):
    # Allows companies to update application progress (e.g., Accepted / Rejected)
    app_record = db.query(Application).filter(Application.application_id == application_id).first()
    if not app_record:
        raise HTTPException(status_code=404, detail="Application record not found")
        
    app_record.status = payload.status
    db.commit()
    db.refresh(app_record)
    return app_record