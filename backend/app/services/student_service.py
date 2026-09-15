from sqlalchemy.orm import Session
from app.models.student import StudentProfile
from app.models.admin import AdminProfile
from app.schemas.student_schema import StudentProfileCreate

def create_student_profile_service(db: Session, profile: StudentProfileCreate):
    # 1. Validate that the college code exists in admin_profiles (e.g., '3807')
    college = db.query(AdminProfile).filter(AdminProfile.college_code == profile.college_code).first()
    if not college:
        return None, f"Invalid college code '{profile.college_code}'. Institution not found."
        
    # 2. Check if student profile already exists for this user account
    existing_profile = db.query(StudentProfile).filter(StudentProfile.user_id == profile.user_id).first()
    if existing_profile:
        return None, "Student profile already exists for this user"
        
    new_profile = StudentProfile(
        user_id=profile.user_id,
        college_code=profile.college_code,
        name=profile.name,
        cgpa=profile.cgpa,
        skills=profile.skills
    )
    
    db.add(new_profile)
    db.commit()
    db.refresh(new_profile)
    return new_profile, None

def get_student_profile_service(db: Session, user_id: int):
    # Fetches student profile details by user ID
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == user_id).first()
    if not profile:
        return None, "Student profile not found"
    return profile, None