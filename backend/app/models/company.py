from sqlalchemy import Column, Integer, String, Boolean
from app.core.database import Base

class Company(Base):
    __tablename__="companies"
    company_id=Column(Integer, primary_key=True, index=True)
    name=Column(String, nullable=False)
    email=Column(String, nullable=False, unique=True)
    hashed_password=Column(String, nullable=False)
    description=Column(String, nullable=True)
    is_verified=Column(Boolean, default=False)
    