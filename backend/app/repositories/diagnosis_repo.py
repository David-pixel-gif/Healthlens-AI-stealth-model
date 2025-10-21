import json
from sqlalchemy.orm import Session
from app.models.diagnosis import Diagnosis

def save_diagnosis(db: Session, *, patient_id: int, disease_key: str, label: str, probs: dict, version: str) -> Diagnosis:
    d = Diagnosis(
        patient_id=patient_id,
        disease_key=disease_key,
        label=label,
        probs_json=json.dumps(probs),
        model_version=version
    )
    db.add(d)
    db.commit()
    db.refresh(d)
    return d
