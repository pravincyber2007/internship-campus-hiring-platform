from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.admin import AdminProfile
from app.models.student import StudentProfile
from app.models.application import Application
from app.models.internship import Internship
from app.models.company import CompanyProfile

router = APIRouter(prefix="/admin", tags=["Admin"])

@router.get("/roster/{admin_user_id}")
def get_admin_college_roster(admin_user_id: int, db: Session = Depends(get_db)):
    admin_profile = db.query(AdminProfile).filter(AdminProfile.user_id == admin_user_id).first()
    if not admin_profile:
        raise HTTPException(status_code=404, detail="Admin profile not found")
    
    college_code = admin_profile.college_code
    students = db.query(StudentProfile).filter(StudentProfile.college_code == college_code).all()
    
    student_ids = [s.profile_id for s in students]
    applications = []
    if student_ids:
        raw_apps = db.query(Application).filter(Application.student_id.in_(student_ids)).all()
        for app in raw_apps:
            student = db.query(StudentProfile).filter(StudentProfile.profile_id == app.student_id).first()
            internship = db.query(Internship).filter(Internship.internship_id == app.internship_id).first()
            company = db.query(CompanyProfile).filter(CompanyProfile.profile_id == internship.company_id).first() if internship else None
            applications.append({
                "application_id": app.application_id,
                "status": app.status,
                "applied_date": str(app.applied_date),
                "student_name": student.name if student else "Unknown",
                "student_cgpa": student.cgpa if student else "N/A",
                "internship_title": internship.title if internship else "Unknown Position",
                "company_name": company.name if company else "Unknown Company"
            })

    return {
        "college_code": college_code,
        "college_name": admin_profile.college_name,
        "students": students,
        "applications": applications
    }