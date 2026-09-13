from sqlalchemy import Column, Integer, String, TIMESTAMP, ForeignKey, text
from app.core.database import Base

class Internship(Base):
    __tablename__ = "internships"
    
    internship_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    company_id = Column(Integer, ForeignKey("company_profiles.profile_id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    domain = Column(String(255))
    stipend = Column(Integer)
    duration = Column(String(50))
    created_at = Column(TIMESTAMP, server_default=text("CURRENT_TIMESTAMP"))