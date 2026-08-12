from pydantic import BaseModel, EmailStr
from typing import Optional

class CompanyCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    industry: Optional[str] = "General"
    description: Optional[str] = "None"
    

class CompanyResponse(BaseModel):
    company_id: int
    name: str
    email: EmailStr
    industry: Optional[str] = None

    class Config:
        from_attributes = True