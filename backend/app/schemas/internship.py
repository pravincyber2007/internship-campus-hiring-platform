from pydantic import BaseModel
from typing import Optional

class InternshipCreate(BaseModel):
    title: str
    description: str
    stipend: Optional[str] = None
    location: Optional[str] = None

class InternshipResponse(BaseModel):
    internship_id: int
    title: str
    description: str
    stipend: Optional[str] = None
    location: Optional[str] = None
    company_id: int

    class Config:
        from_attributes = True