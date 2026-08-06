from sqlalchemy import Column, Integer, String, Boolean, Float, ForeignKey
from app.core.database import Base
class Student(Base):
    __tablename__ = "students"

    student_id=Column(Integer, primary_key=True, index=True)
    name=Column(String,nullable=False)
    email=Column(String,unique=True,nullable=False)
    hashed_password=Column(String,nullable=False)
    college_name=Column(String,nullable=False)
    cgpa=Column(Float,nullable=False)
    skills=Column(String,nullable=False)
    is_verified=Column(Boolean,default=False)

    verified_by=Column(Integer,ForeignKey("admins.admin_id"),nullable=True)
    