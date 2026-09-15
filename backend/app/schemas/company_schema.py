from pydantic import BaseModel
from typing import Optional

class CompanyProfileCreate(BaseModel):
    user_id: int
    name: str
    industry: Optional[str] = None

class CompanyProfileResponse(BaseModel):
    profile_id: int
    user_id: int
    name: str
    industry: Optional[str] = None

    class Config:
        from_attributes = True