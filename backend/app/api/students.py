from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.student import StudentCreate, StudentResponse

from app.services.student_service import create_student_service

from fastapi.security import OAuth2PasswordRequestForm
from app.services.student_service import create_student_service, authenticate_student_service

router = APIRouter(
    prefix="/api/students",
    tags=["Students"]
)

@router.post("/register", response_model=StudentResponse,status_code=status.HTTP_201_CREATED)
def register_student(student: StudentCreate, db: Session = Depends(get_db)):
    return create_student_service(student, db)

@router.post("/login")
def login_student(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    return authenticate_student_service(email=form_data.username, password=form_data.password, db=db)

#for the getting the student details after login  in secure path, fetched .

from fastapi import HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from app.models.student import Student
from app.core.security import SECRET_KEY, ALGORITHM

outh2_scheme = OAuth2PasswordBearer(tokenUrl="/api/students/login")

def get_current_student(token: str = Depends(outh2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
            raise credentials_exception
    student = db.query(Student).filter(Student.email == email).first()
    if student is None:
        raise credentials_exception
    return student

@router.get("/me", response_model=StudentResponse)
def get_student_profile(current_student: Student = Depends(get_current_student)):
    return current_student
