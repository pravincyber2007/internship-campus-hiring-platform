from pydantic import BaseModel
from typing import Optional

class StudentProfileCreate(BaseModel):
    user_id: int
    college_code: str
    name: str
    cgpa: Optional[float] = None
    skills: Optional[str] = None

class StudentProfileResponse(BaseModel):
    profile_id: int
    user_id: int
    college_code: str
    name: str
    cgpa: Optional[float] = None
    skills: Optional[str] = None

    class Config:
        from_attributes = True