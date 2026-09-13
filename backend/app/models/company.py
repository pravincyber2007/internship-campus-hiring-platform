from sqlalchemy import Column, Integer, String, ForeignKey
from app.core.database import Base

class CompanyProfile(Base):
    __tablename__ = "company_profiles"
    
    profile_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), unique=True, nullable=False)
    name = Column(String(255), nullable=False)
    industry = Column(String(255))