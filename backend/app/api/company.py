from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.company_schema import CompanyProfileCreate, CompanyProfileResponse
from app.services.company_service import create_company_profile_service

router = APIRouter(prefix="/companies", tags=["Companies"])

@router.post("/profile", response_model=CompanyProfileResponse)
def create_company_profile(profile: CompanyProfileCreate, db: Session = Depends(get_db)):
    """
    Registers a new corporate recruiter profile tied to an approved user account.
    """
    new_profile, error = create_company_profile_service(db, profile)
    if error:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=error)
    return new_profile