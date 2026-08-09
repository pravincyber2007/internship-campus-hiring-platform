from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.company import Company
from app.schemas.company import CompanyCreate
from app.core.security import get_password_hash

def create_company_service(company_data: CompanyCreate, db: Session):
    # 1. Email already irukka nu check panrom
    existing_company = db.query(Company).filter(Company.email == company_data.email).first()
    if existing_company:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered with another company"
        )
    
    # 2. Password-a hash panrom
    hashed_password = get_password_hash(company_data.password)
    
    # 3. New company object create panrom
    new_company = Company(
        name=company_data.name,
        email=company_data.email,
        hashed_password=hashed_password,
        description=company_data.description,
        is_verified=False  # Default-a unverified-a irukkum
    )
    
    db.add(new_company)
    db.commit()
    db.refresh(new_company)
    
    return new_company

from app.core.security import verify_password, create_access_token # type: ignore

def authenticate_company_service(email: str, password: str, db: Session):
    company = db.query(Company).filter(Company.email == email).first()
    if not company:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    if not verify_password(password, company.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    # Token-la "role": "company" nu add panni anuppalam, security-kku nallathu
    access_token = create_access_token(data={"sub": company.email, "role": "company"})
    
    return {"access_token": access_token, "token_type": "bearer"}