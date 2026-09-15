from pydantic import BaseModel

class AdminProfileCreate(BaseModel):
    user_id: int
    college_code: str
    college_name: str

class AdminProfileResponse(BaseModel):
    profile_id: int
    user_id: int
    college_code: str
    college_name: str

    class Config:
        from_attributes = True