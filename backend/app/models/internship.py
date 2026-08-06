from sqlalchemy import Column, Integer, String, ForeignKey
from app.core.database import Base

class Internship(Base):
    __tablename__="internships"
    internship_id=Column(Integer, primary_key=True, index=True)
    title=Column(String, nullable=False)
    description=Column(String, nullable=False)
    stipend=Column(String, nullable=True)
    location=Column(String, nullable=True)
    
    company_id=Column(Integer, ForeignKey("companies.company_id"), nullable=False)