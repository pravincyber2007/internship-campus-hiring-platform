from sqlalchemy.orm import Session
from app.models.internship import Internship
from app.schemas.internship import InternshipCreate

def create_internship_service(internship_data: InternshipCreate, company_id: int, db: Session):
    new_internship = Internship(
        title=internship_data.title,
        description=internship_data.description,
        stipend=internship_data.stipend,
        location=internship_data.location,
        company_id=company_id
    )
    
    db.add(new_internship)
    db.commit()
    db.refresh(new_internship)
    
    return new_internship