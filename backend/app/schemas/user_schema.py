from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    role: str  # 'admin', 'student', 'company'

class UserResponse(BaseModel):
    user_id: int
    email: EmailStr
    role: str
    created_at: datetime

    class Config:
        from_attributes = True

class UnifiedRegisterSchema(BaseModel):
    email: EmailStr
    password: str
    role: str # 'student' | 'company' | 'admin'
    
    # Optional profile fields depending on role
    name: Optional[str] = None
    college_code: Optional[str] = None  
    college_name: Optional[str] = None
    cgpa: Optional[float] = None
    skills: Optional[str] = None
    
    company_name: Optional[str] = None
    industry: Optional[str] = None
    
    admin_name: Optional[str] = None

    class Config:
        from_attributes = True