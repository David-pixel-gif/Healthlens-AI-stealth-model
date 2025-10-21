from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.orm import Session
from typing import List, Dict

# adjust if your session dependency lives elsewhere
from app.db.session import get_db
from app.models.diagnosis import Diagnosis

router = APIRouter(prefix="/api", tags=["dashboard"])

SUPPORTED_DISEASES: List[Dict] = [
    {"key": "skin_cancer",  "name": "Skin Cancer",    "model_version": "v1", "loaded": False},
    {"key": "brain_tumor",  "name": "Brain Tumor",    "model_version": "v1", "loaded": False},
    {"key": "malnutrition", "name": "Malnutrition",   "model_version": "v1", "loaded": False},
    {"key": "tb",           "name": "Tuberculosis",   "model_version": "v1", "loaded": False},
    {"key": "malaria",      "name": "Malaria",        "model_version": "v1", "loaded": False},
]


@router.get("/stats/summary")
def stats_summary(window: str = "today", db: Session = Depends(get_db)):
    total = 0
    positive_flags = 0
    try:
        total = db.query(Diagnosis).count()
        if hasattr(Diagnosis, "label"):
            positive_flags = db.query(Diagnosis).filter(
                getattr(Diagnosis, "label").in_(["positive", "suspected"])
            ).count()
    except Exception:
        # DB not ready or table missing — return safe defaults
        pass

    return {
        "new_diagnoses": total,          # refine by window later
        "positive_flags": positive_flags,
        "avg_inference_ms": 0,
        "jobs_in_progress": 0,
    }


@router.get("/diseases")
def list_diseases():
    return {"items": SUPPORTED_DISEASES}


@router.get("/diagnoses/recent")
def diagnoses_recent(limit: int = 20, db: Session = Depends(get_db)):
    items = []
    try:
        # order by created_at if exists, else by id
        order_col = getattr(Diagnosis, "created_at", Diagnosis.id)
        rows = db.query(Diagnosis).order_by(order_col.desc()).limit(limit).all()

        def row_to_item(d):
            return {
                "id": d.id,
                "created_at": getattr(d, "created_at", None),
                "patient": {"id": d.id, "name": getattr(d, "patient_name", "—")},
                "disease_key": getattr(d, "disease_key", None),
                "label": getattr(d, "label", None),
                "confidence": getattr(d, "confidence", None),
                "model_version": getattr(d, "model_version", None),
            }

        items = [row_to_item(d) for d in rows]
    except Exception:
        # DB not reachable yet — return empty list
        items = []

    return {"items": items}


@router.get("/jobs")
def jobs(status: str = "queued,running", limit: int = 20):
    # Stub so the UI stops 404ing; wire real queue later
    return {"items": []}


@router.get("/alerts")
def alerts():
    return {"high_risk": [], "service_issues": [], "data_quality": []}


@router.get("/status/health")
def status_health():
    return {
        "api": {"ok": True, "latency_ms": 0},
        "db": {"ok": True},
        "pipelines": [
            {"key": d["key"], "loaded": d["loaded"], "model_version": d["model_version"]}
            for d in SUPPORTED_DISEASES
        ],
    }


# (Optional) stubs so Detect pages can POST without 404 (wire real logic later)
@router.post("/diseases/skin_cancer/infer")
def infer_skin_cancer(file: UploadFile = File(...)):
    return {"status": "not_implemented", "disease": "skin_cancer"}


@router.post("/diseases/brain_tumor/infer")
def infer_brain_tumor(file: UploadFile = File(...)):
    return {"status": "not_implemented", "disease": "brain_tumor"}


@router.post("/diseases/malnutrition/infer")
def infer_malnutrition(features: dict):
    return {"status": "not_implemented", "disease": "malnutrition"}


@router.post("/diseases/tb/infer")
def infer_tb(file: UploadFile = File(...)):
    return {"status": "not_implemented", "disease": "tb"}


@router.post("/diseases/malaria/infer")
def infer_malaria(file: UploadFile = File(...)):
    return {"status": "not_implemented", "disease": "malaria"}
