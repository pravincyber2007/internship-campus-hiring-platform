from sqlalchemy import Column, Integer, String, ForeignKey
from app.core.database import Base

class Application(Base):
    __tablename__="applications"
    application_id=Column(Integer, primary_key=True, index=True)
    status=Column(String, default="pending")

    student_id=Column(Integer, ForeignKey("students.student_id"), nullable=False)
    internship_id=Column(Integer, ForeignKey("internships.internship_id"), nullable=False)
    