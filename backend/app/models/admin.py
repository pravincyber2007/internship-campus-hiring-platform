from sqlalchemy import Column, Integer, String, ForeignKey
from app.core.database import Base

class AdminProfile(Base):
    __tablename__ = "admin_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"))
    name = Column(String(255), nullable=True)  # <-- Add this line
    college_code = Column(String(100), nullable=True)
    college_name = Column(String(255), nullable=True)