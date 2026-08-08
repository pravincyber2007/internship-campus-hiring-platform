from pydantic import BaseModel, EmailStr

class StudentCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    college_name: str
    cgpa: float
    skills: str

class StudentResponse(BaseModel):
    student_id: int
    name: str
    email: EmailStr
    college_name: str
    is_verified: bool    

    class Config:
        from_attributes = True
        