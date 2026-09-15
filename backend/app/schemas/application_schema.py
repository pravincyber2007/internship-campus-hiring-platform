from pydantic import BaseModel
from datetime import datetime

class ApplicationCreate(BaseModel):
    student_id: int
    internship_id: int

class ApplicationUpdateStatus(BaseModel):
    status: str  # 'Under Review', 'Accepted', 'Rejected'

class ApplicationResponse(BaseModel):
    application_id: int
    student_id: int
    internship_id: int
    status: str
    applied_date: datetime

    class Config:
        from_attributes = True