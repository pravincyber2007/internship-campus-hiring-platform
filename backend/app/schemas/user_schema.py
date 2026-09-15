from pydantic import BaseModel, EmailStr
from datetime import datetime

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