from sqlalchemy import Column, Integer, String, Float, Text, ForeignKey
from app.core.database import Base

class StudentProfile(Base):
    __tablename__ = "student_profiles"
    
    profile_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), unique=True, nullable=False)
    college_code = Column(String(4), ForeignKey("admin_profiles.college_code", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    college_name = Column(String(255))
    cgpa = Column(Float)
    skills = Column(Text)