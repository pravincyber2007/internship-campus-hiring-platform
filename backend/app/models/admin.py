from sqlalchemy import Column, Integer, String, ForeignKey
from app.core.database import Base

class AdminProfile(Base):
    __tablename__ = "admin_profiles"
    
    profile_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), unique=True, nullable=False)
    college_code = Column(String(4), unique=True, nullable=False)
    college_name = Column(String(255), nullable=False)