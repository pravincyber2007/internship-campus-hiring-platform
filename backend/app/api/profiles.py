from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional
from app.core.database import get_db
from app.models.user import User
from app.models.student import StudentProfile
from app.models.company import CompanyProfile
from app.models.admin import AdminProfile
from pydantic import BaseModel

router = APIRouter(tags=["Profiles"])

class ProfileUpdateSchema(BaseModel):
    name: Optional[str] = None
    college_name: Optional[str] = None
    college_code: Optional[str] = None
    cgpa: Optional[float] = None
    skills: Optional[str] = None
    industry: Optional[str] = None

@router.get("/student/user/{user_id}")
def get_student_by_user(user_id: int, db: Session = Depends(get_db)):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == user_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Student profile not found")
    return profile

@router.get("/company/user/{user_id}")
def get_company_by_user(user_id: int, db: Session = Depends(get_db)):
    profile = db.query(CompanyProfile).filter(CompanyProfile.user_id == user_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Company profile not found")
    return profile

@router.get("/admin/user/{user_id}")
def get_admin_by_user(user_id: int, db: Session = Depends(get_db)):
    profile = db.query(AdminProfile).filter(AdminProfile.user_id == user_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Admin profile not found")
    return profile

@router.put("/admin/user/{user_id}")
def update_admin_profile(user_id: int, payload: ProfileUpdateSchema, db: Session = Depends(get_db)):
    profile = db.query(AdminProfile).filter(AdminProfile.user_id == user_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    if payload.college_name: profile.college_name = payload.college_name
    if payload.college_code: profile.college_code = payload.college_code
    
    db.commit()
    return {"message": "Admin profile updated successfully"}

@router.put("/student/user/{user_id}")
def update_student_profile(user_id: int, payload: ProfileUpdateSchema, db: Session = Depends(get_db)):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == user_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    if payload.name: profile.name = payload.name
    if payload.college_name: profile.college_name = payload.college_name
    if payload.college_code: profile.college_code = payload.college_code
    if payload.cgpa is not None: profile.cgpa = payload.cgpa
    if payload.skills: profile.skills = payload.skills
    
    db.commit()
    return {"message": "Profile updated successfully"}

@router.put("/company/user/{user_id}")
def update_company_profile(user_id: int, payload: ProfileUpdateSchema, db: Session = Depends(get_db)):
    profile = db.query(CompanyProfile).filter(CompanyProfile.user_id == user_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    if payload.name: profile.name = payload.name
    if payload.industry: profile.industry = payload.industry
    
    db.commit()
    return {"message": "Profile updated successfully"}

@router.delete("/user/{user_id}")
def delete_account(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(user)
    db.commit()
    return {"message": "Account deleted successfully"}