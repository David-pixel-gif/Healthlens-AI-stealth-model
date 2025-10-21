from pydantic import BaseModel

class PatientCreate(BaseModel):
    name: str
    demographics: str = "{}"

class PatientOut(BaseModel):
    id: int
    name: str
    demographics: str
    class Config:
        from_attributes = True
