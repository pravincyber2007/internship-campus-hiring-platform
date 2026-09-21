from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.student import StudentProfile
from app.models.internship import Internship
from app.models.company import CompanyProfile
from pydantic import BaseModel

router = APIRouter(tags=["Student Portal"])

@router.get("/student/profile/{user_id}")
def get_student_profile(user_id: int, db: Session = Depends(get_db)):
    student = db.query(StudentProfile).filter(StudentProfile.user_id == user_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found")
    return student

@router.get("/student/internships")
def get_available_internships(db: Session = Depends(get_db)):
    internships = db.query(Internship).all()
    results = []
    for i in internships:
        company = db.query(CompanyProfile).filter(CompanyProfile.profile_id == i.company_id).first()
        results.append({
            "internship_id": i.internship_id,
            "title": i.title,
            "domain": i.domain,
            "stipend": i.stipend,
            "duration": i.duration,
            "company_name": company.name if company else "Independent Company"
        })
    return results