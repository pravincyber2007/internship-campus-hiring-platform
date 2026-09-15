from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.student_schema import StudentProfileCreate, StudentProfileResponse
from app.services.student_service import (
    create_student_profile_service, 
    get_student_profile_service
)

router = APIRouter(prefix="/students", tags=["Students"])

@router.post("/profile", response_model=StudentProfileResponse)
def create_student_profile(profile: StudentProfileCreate, db: Session = Depends(get_db)):
    """
    Creates a new student profile and validates the institutional college code (e.g., '3807').
    """
    new_profile, error = create_student_profile_service(db, profile)
    if error:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=error)
    return new_profile

@router.get("/profile/{user_id}", response_model=StudentProfileResponse)
def get_student_profile(user_id: int, db: Session = Depends(get_db)):
    """
    Retrieves student profile information using their account user ID.
    """
    profile, error = get_student_profile_service(db, user_id)
    if error:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=error)
    return profile