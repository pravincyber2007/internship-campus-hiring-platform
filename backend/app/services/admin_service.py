from sqlalchemy.orm import Session
from app.models.admin import AdminProfile
from app.models.student import StudentProfile
from app.schemas.admin_schema import AdminProfileCreate

def register_institution_service(db: Session, admin: AdminProfileCreate):
    # Check if college code (e.g. '3807') is already registered
    existing_admin = db.query(AdminProfile).filter(AdminProfile.college_code == admin.college_code).first()
    if existing_admin:
        return None
        
    new_admin = AdminProfile(
        college_code=admin.college_code,
        admin_name=admin.admin_name,
        email=admin.email
    )
    db.add(new_admin)
    db.commit()
    db.refresh(new_admin)
    return new_admin

def get_college_students_service(db: Session, college_code: str):
    # Verify if the institution exists
    admin = db.query(AdminProfile).filter(AdminProfile.college_code == college_code).first()
    if not admin:
        return None, "Institution college code not found"
        
    # Fetch all student profiles matching the college code (e.g., '3807')
    students = db.query(StudentProfile).filter(StudentProfile.college_code == college_code).all()
    return students, None