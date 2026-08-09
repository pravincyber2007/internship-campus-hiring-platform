from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.company import CompanyCreate, CompanyResponse
from app.services.company_service import create_company_service

router = APIRouter(
    prefix="/api/companies",
    tags=["Companies"]
)

@router.post("/register", response_model=CompanyResponse, status_code=status.HTTP_201_CREATED)
def register_company(company: CompanyCreate, db: Session = Depends(get_db)):
    return create_company_service(company, db)

from fastapi.security import OAuth2PasswordRequestForm
from app.services.company_service import authenticate_company_service # Make sure to import this

@router.post("/login")
def login_company(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    return authenticate_company_service(email=form_data.username, password=form_data.password, db=db)