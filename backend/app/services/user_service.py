from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user_schema import UserCreate

def create_user_service(db: Session, user: UserCreate):
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        return None
    
    hashed_password = f"hash_{user.password}"
    new_user = User(
        email=user.email,
        password_hash=hashed_password,
        role=user.role
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user