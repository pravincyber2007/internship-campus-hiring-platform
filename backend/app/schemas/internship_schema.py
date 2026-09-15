from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class InternshipCreate(BaseModel):
    company_id: int
    title: str
    domain: Optional[str] = None
    stipend: Optional[int] = None
    duration: Optional[str] = None

class InternshipResponse(BaseModel):
    internship_id: int
    company_id: int
    title: str
    domain: Optional[str] = None
    stipend: Optional[int] = None
    duration: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True