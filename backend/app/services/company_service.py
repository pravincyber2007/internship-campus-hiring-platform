from sqlalchemy.orm import Session
from app.models.company import CompanyProfile
from app.schemas.company_schema import CompanyProfileCreate

def create_company_profile_service(db: Session, profile: CompanyProfileCreate):
    # Check if company profile already exists for this user account
    existing_profile = db.query(CompanyProfile).filter(CompanyProfile.user_id == profile.user_id).first()
    if existing_profile:
        return None, "Company profile already exists for this user"
        
    new_profile = CompanyProfile(
        user_id=profile.user_id,
        name=profile.name,
        industry=profile.industry
    )
    
    db.add(new_profile)
    db.commit()
    db.refresh(new_profile)
    return new_profile, None

def get_company_profile_service(db: Session, profile_id: int):
    # Fetches company details by profile ID
    company = db.query(CompanyProfile).filter(CompanyProfile.profile_id == profile_id).first()
    if not company:
        return None, "Company profile not found"
    return company, None