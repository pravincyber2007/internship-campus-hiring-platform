from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.company import CompanyProfile
from app.models.internship import Internship
from app.models.application import Application
from app.models.student import StudentProfile # Adjust if your student model name differs
from pydantic import BaseModel

router = APIRouter(tags=["Company Portal"])

class StatusUpdate(BaseModel):
    status: str # "onreview", "accepted", "rejected"

@router.get("/company/internships/{user_id}")
def get_company_internships(user_id: int, db: Session = Depends(get_db)):
    # Find company profile by user_id
    company = db.query(CompanyProfile).filter(CompanyProfile.user_id == user_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company profile not found")
    
    # Fetch internships belonging to this company's profile_id
    internships = db.query(Internship).filter(Internship.company_id == company.profile_id).all()
    
    results = []
    for i in internships:
        # Count applicants for each internship
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

@router.get("/company/internship-applicants/{company_user_id}")
def get_internship_applicants(company_user_id: int, db: Session = Depends(get_db)):
    company = db.query(CompanyProfile).filter(CompanyProfile.user_id == company_user_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company profile not found")
    
    internships = db.query(Internship).filter(Internship.company_id == company.profile_id).all()
    internship_ids = [i.internship_id for i in internships]
    
    # Fetch all applications for this company's internships
    applications = db.query(Application).filter(Application.internship_id.in_(internship_ids)).all()
    
    detailed_apps = []
    for app in applications:
        student = db.query(StudentProfile).filter(StudentProfile.user_id == app.student_id).first()
        internship = db.query(Internship).filter(Internship.internship_id == app.internship_id).first()
        
        detailed_apps.append({
            "application_id": app.application_id,
            "internship_title": internship.title if internship else "Unknown",
            "student_name": student.name if student else "Student",
            "college_name": student.college_name if student else "Unknown College",
            "status": app.status # "applied", "onreview", "accepted", "rejected"
        })
        
    return detailed_apps

@router.put("/company/application-status/{application_id}")
def update_application_status(application_id: int, payload: StatusUpdate, db: Session = Depends(get_db)):
    application = db.query(Application).filter(Application.application_id == application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    application.status = payload.status
    db.commit()
    return {"message": f"Application status updated to {payload.status}"}