from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.internship import Internship
from app.models.company import CompanyProfile
from app.schemas.internship_schema import InternshipCreate, InternshipResponse

router = APIRouter(prefix="/internships", tags=["Internships"])

@router.post("/", response_model=InternshipResponse)
def post_internship(internship: InternshipCreate, db: Session = Depends(get_db)):
    # Verify company profile exists
    company = db.query(CompanyProfile).filter(CompanyProfile.profile_id == internship.company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company profile not found")
        
    new_internship = Internship(
        company_id=internship.company_id,
        title=internship.title,
        domain=internship.domain,
        stipend=internship.stipend,
        duration=internship.duration
    )
    
    db.add(new_internship)
    db.commit()
    db.refresh(new_internship)
    return new_internship

@router.get("/", response_model=List[InternshipResponse])
def get_all_internships(db: Session = Depends(get_db)):
    # Students browse all open internship listings
    return db.query(Internship).all()