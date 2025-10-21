from pydantic import BaseModel
from typing import Dict

class DiagnosisOut(BaseModel):
    id: int | None = None
    disease_key: str
    label: str
    probs: Dict[str, float]
    model_version: str = "v1"
