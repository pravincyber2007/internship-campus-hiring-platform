from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.company import CompanyProfile
from app.models.internship import Internship
from pydantic import BaseModel

router = APIRouter(tags=["Internships"])

class InternshipCreate(BaseModel):
    user_id: int
    title: str
    domain: str
    stipend: int
    duration: str

@router.post("/internship")
@router.post("/internship/")
def post_internship(payload: InternshipCreate, db: Session = Depends(get_db)):
    company = db.query(CompanyProfile).filter(CompanyProfile.user_id == payload.user_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company profile not found for this user")

    new_internship = Internship(
        company_id=company.profile_id,
        title=payload.title,
        domain=payload.domain,
        stipend=payload.stipend,
        duration=payload.duration
    )
    db.add(new_internship)
    db.commit()
    db.refresh(new_internship)
    return {"message": "Internship posted successfully", "internship_id": new_internship.internship_id}

@router.get("/internship")
@router.get("/internship/")
def get_all_internships(db: Session = Depends(get_db)):
    internships = db.query(Internship).all()
    results = []
    for i in internships:
        company = db.query(CompanyProfile).filter(CompanyProfile.profile_id == i.company_id).first()
        results.append({
            "internship_id": i.internship_id,
            "title": i.title,
            "domain": i.domain,
            "stipend": i.stipend,
            "duration": i.duration,
            "company_name": company.name if company else "Independent Company"
        })
    return results