from sqlalchemy.orm import Session
from app.models.admin import AdminProfile
from app.models.student import StudentProfile
from app.models.application import Application
from app.models.internship import Internship

def get_college_students_service(db: Session, college_code: str):
    # 1. Verify if the institution exists
    admin = db.query(AdminProfile).filter(AdminProfile.college_code == college_code).first()
    if not admin:
        return None, "Institution college code not found"
        
    # 2. Fetch all student profiles matching the college code (e.g., '3807')
    students = db.query(StudentProfile).filter(StudentProfile.college_code == college_code).all()
    return students, None

def get_college_tracking_overview_service(db: Session, college_code: str):
    # Advanced tracking: fetches students and their application progress linked to this college code
    admin = db.query(AdminProfile).filter(AdminProfile.college_code == college_code).first()
    if not admin:
        return None, "Institution college code not found"
        
    # Query students joined with their applications and internship postings
    results = db.query(StudentProfile, Application, Internship).\
        outerjoin(Application, StudentProfile.profile_id == Application.student_id).\
        outerjoin(Internship, Application.internship_id == Internship.internship_id).\
        filter(StudentProfile.college_code == college_code).all()
        
    return results, None