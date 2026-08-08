from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.student import Student
from app.schemas.student import StudentCreate
from app.core.security import get_password_hash

def  create_student_service(student: StudentCreate, db: Session):
    db_student = db.query(Student).filter(Student.email == student.email).first()
    if db_student:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_pwd=get_password_hash(student.password)
    new_student = Student(
        name=student.name,
        email=student.email,
        hashed_password=hashed_pwd,
        college_name=student.college_name,
        cgpa=student.cgpa,
        skills=student.skills
    )
    db.add(new_student)
    db.commit()
    db.refresh(new_student)
    return new_student

from app.core.security import verify_password,create_access_token
def authenticate_student_service(email: str, password: str, db: Session):
    student = db.query(Student).filter(Student.email == email).first()
    if not student:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    if not verify_password(password, student.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    access_token = create_access_token(data={"sub": student.email})
    return {"access_token": access_token, "token_type": "bearer"}
