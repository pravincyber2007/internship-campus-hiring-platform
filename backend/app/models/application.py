from sqlalchemy import Column, Integer, String, TIMESTAMP, ForeignKey, text
from app.core.database import Base

class Application(Base):
    __tablename__ = "applications"

    application_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    student_id = Column(Integer, ForeignKey("student_profiles.profile_id", ondelete="CASCADE"), nullable=False)
    internship_id = Column(Integer, ForeignKey("internships.internship_id", ondelete="CASCADE"), nullable=False)
    status = Column(String(50), default="applied", server_default="applied")
    applied_date = Column(TIMESTAMP, server_default=text("CURRENT_TIMESTAMP"))