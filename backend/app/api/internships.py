from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.internship import InternshipCreate, InternshipResponse
from app.services.internship_service import create_internship_service
# Neenga unga security file-la irunthu get_current_company import pannunga
from app.core.security import get_current_company 

router = APIRouter(
    prefix="/api/internships",
    tags=["Internships"]
)

@router.post("/post", response_model=InternshipResponse, status_code=status.HTTP_201_CREATED)
def post_internship(
    internship: InternshipCreate, 
    db: Session = Depends(get_db),
    current_company: dict = Depends(get_current_company) # JWT token check panrom
):
    # current_company['company_id']-a service-kku pass panrom
    return create_internship_service(internship, current_company['company_id'], db)

from typing import List
from app.schemas.internship import InternshipResponse # unga schema name-ku etha maathiri

@router.get("/", response_model=List[InternshipResponse])
def get_all_internships(db: Session = Depends(get_db)):
    # Database-la irukkura ellaa internships-ayum fetch panni return panra service or query
    from app.models.internship import Internship # unga model path-ku etha maathiri
    return db.query(Internship).all()