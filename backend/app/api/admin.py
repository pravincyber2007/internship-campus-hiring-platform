from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.schemas.admin_schema import AdminProfileCreate, AdminProfileResponse
from app.schemas.student_schema import StudentProfileResponse
from app.services.admin_service import register_institution_service, get_college_students_service

router = APIRouter(prefix="/admin", tags=["Admin & Institutional Tracking"])

@router.post("/institution", response_model=AdminProfileResponse)
def register_institution(admin: AdminProfileCreate, db: Session = Depends(get_db)):
    new_admin = register_institution_service(db, admin)
    if not new_admin:
        raise HTTPException(status_code=400, detail="College code is already registered")
    return new_admin

@router.get("/students/{college_code}", response_model=List[StudentProfileResponse])
def get_college_students(college_code: str, db: Session = Depends(get_db)):
    # Tracks student engagement using institutional college code '3807'
    students, error = get_college_students_service(db, college_code)
    if error:
        raise HTTPException(status_code=404, detail=error)
    return students