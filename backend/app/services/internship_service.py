from sqlalchemy.orm import Session
from app.models.internship import Internship
from app.models.company import CompanyProfile
from app.schemas.internship_schema import InternshipCreate

def create_internship_service(db: Session, internship: InternshipCreate):
    # Verify that the company profile exists before posting
    company = db.query(CompanyProfile).filter(CompanyProfile.profile_id == internship.company_id).first()
    if not company:
        return None, "Company profile not found"
        
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
    return new_internship, None

def get_all_internships_service(db: Session):
    # Fetches all open internship listings for student browsing
    return db.query(Internship).all()