from sqlalchemy.orm import Session
from app.models.application import Application
from app.models.student import StudentProfile
from app.models.internship import Internship
from app.schemas.application_schema import ApplicationCreate, ApplicationUpdateStatus

def apply_internship_service(db: Session, application: ApplicationCreate):
    # Verify student exists
    student = db.query(StudentProfile).filter(StudentProfile.profile_id == application.student_id).first()
    if not student:
        return None, "Student profile not found"
        
    # Verify internship exists
    internship = db.query(Internship).filter(Internship.internship_id == application.internship_id).first()
    if not internship:
        return None, "Internship listing not found"
        
    # Check if student already applied for this role
    existing_app = db.query(Application).filter(
        Application.student_id == application.student_id,
        Application.internship_id == application.internship_id
    ).first()
    
    if existing_app:
        return None, "You have already applied for this internship"
        
    new_application = Application(
        student_id=application.student_id,
        internship_id=application.internship_id,
        status="Applied"
    )
    
    db.add(new_application)
    db.commit()
    db.refresh(new_application)
    return new_application, None

def get_student_applications_service(db: Session, student_id: int):
    # Fetches all applications for real-time student tracking
    return db.query(Application).filter(Application.student_id == student_id).all()

def update_application_status_service(db: Session, application_id: int, payload: ApplicationUpdateStatus):
    # Allows companies to update application progress
    app_record = db.query(Application).filter(Application.application_id == application_id).first()
    if not app_record:
        return None, "Application record not found"
        
    app_record.status = payload.status
    db.commit()
    db.refresh(app_record)
    return app_record, None