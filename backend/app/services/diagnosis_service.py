from sqlalchemy.orm import Session
from typing import Dict
from app.repositories.diagnosis_repo import save_diagnosis

def persist_diagnosis(db: Session, patient_id: int, disease_key: str, result: Dict, version: str):
    return save_diagnosis(
        db,
        patient_id=patient_id,
        disease_key=disease_key,
        label=result.get("label"),
        probs=result.get("probs", {}),
        version=version
    )
