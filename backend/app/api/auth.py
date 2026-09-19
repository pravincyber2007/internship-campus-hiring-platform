from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from app.core.database import get_db
from app.models.user import User
from app.models.student import StudentProfile
from app.models.company import CompanyProfile
from app.models.admin import AdminProfile
from app.schemas.user_schema import UnifiedRegisterSchema
from pydantic import BaseModel, EmailStr

router = APIRouter(prefix="/auth", tags=["Auth"])

# CryptContext setup for secure password hashing (bcrypt)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class LoginSchema(BaseModel):
    email: EmailStr
    password: str

@router.post("/register")
def register_user(payload: UnifiedRegisterSchema, db: Session = Depends(get_db)):
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == payload.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email is already registered")

    try:
        # 1. Hash the password securely into an unreadable format
        hashed_password = pwd_context.hash(payload.password)

        # 2. Create Core User with hashed password
        new_user = User(
            email=payload.email,
            password_hash=hashed_password,  
            role=payload.role
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        # 3. Automatically Link & Create Profile Table Based on Role
        if payload.role == "student":
            student_profile = StudentProfile(
                user_id=new_user.user_id,
                name=payload.name or "Student",
                college_code=payload.college_code or "",
                college_name=payload.college_name,
                cgpa=payload.cgpa,
                skills=payload.skills
            )
            db.add(student_profile)
        elif payload.role == "company":
            company_profile = CompanyProfile(
                user_id=new_user.user_id,
                name=payload.company_name or "Corporate Partner",
                industry=payload.industry or "Technology"
            )
            db.add(company_profile)
        elif payload.role == "admin":
            admin_profile = AdminProfile(
                user_id=new_user.user_id,
                college_code=payload.college_code or "",
                college_name=payload.college_name or "Institution"
            )
            db.add(admin_profile)

        db.commit()
        return {"message": "User and profile registered successfully", "user_id": new_user.user_id}
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database registration failed: {str(e)}")

@router.post("/login")
def login_user(payload: LoginSchema, db: Session = Depends(get_db)):
    # 1. Verify user exists in DB
    user = db.query(User).filter(User.email == payload.email).first()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    # 2. Verify password securely against the stored hash
    if not pwd_context.verify(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    # 3. Return session identifiers
    return {
        "message": "Login successful",
        "user_id": user.user_id,
        "role": user.role,
        "email": user.email
    }