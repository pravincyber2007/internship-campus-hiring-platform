from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.company import CompanyProfile
from app.models.internship import Internship
from app.models.application import Application
from app.models.student import StudentProfile
from pydantic import BaseModel

router = APIRouter(tags=["Company Portal"])

class StatusUpdate(BaseModel):
    status: str

@router.get("/internships/{user_id}")
def get_company_internships(user_id: int, db: Session = Depends(get_db)):
    # Look up by user_id first, with a fallback to profile_id
    company = db.query(CompanyProfile).filter(CompanyProfile.user_id == user_id).first()
    if not company:
        company = db.query(CompanyProfile).filter(CompanyProfile.profile_id == user_id).first()
        if not company:
            return []
    
    # Fetch internships belonging to this company's profile_id
    internships = db.query(Internship).filter(Internship.company_id == company.profile_id).all()
    
    results = []
    for i in internships:
        applicant_count = db.query(Application).filter(Application.internship_id == i.internship_id).count()
        results.append({
            "internship_id": i.internship_id,
            "title": i.title,
            "domain": i.domain,
            "stipend": i.stipend,
            "duration": i.duration,
            "applicant_count": applicant_count
        })
    return results

@router.get("/internship-applicants/{company_user_id}")
def get_internship_applicants(company_user_id: int, db: Session = Depends(get_db)):
    company = db.query(CompanyProfile).filter(CompanyProfile.user_id == company_user_id).first()
    if not company:
        company = db.query(CompanyProfile).filter(CompanyProfile.profile_id == company_user_id).first()
        if not company:
            return []
    
    internships = db.query(Internship).filter(Internship.company_id == company.profile_id).all()
    internship_ids = [i.internship_id for i in internships]
    
    applications = db.query(Application).filter(Application.internship_id.in_(internship_ids)).all()
    
    detailed_apps = []
    for app in applications:
        student = db.query(StudentProfile).filter(StudentProfile.profile_id == app.student_id).first()
        internship = db.query(Internship).filter(Internship.internship_id == app.internship_id).first()
        
        detailed_apps.append({
            "application_id": app.application_id,
            "internship_title": internship.title if internship else "Unknown",
            "student_name": student.name if student else "Student",
            "college_name": student.college_name if student else "Unknown College",
            "status": app.status
        })
        
    return detailed_apps

@router.put("/application-status/{application_id}")
def update_application_status(application_id: int, payload: StatusUpdate, db: Session = Depends(get_db)):
    application = db.query(Application).filter(Application.application_id == application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    normalized_status = payload.status.strip().lower()
    allowed_statuses = {"applied", "onreview", "accepted", "rejected"}
    if normalized_status not in allowed_statuses:
        raise HTTPException(status_code=400, detail="Invalid status value")

    application.status = normalized_status
    db.commit()
    return {"message": f"Application status updated to {normalized_status}"}