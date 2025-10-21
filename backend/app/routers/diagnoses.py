from fastapi import APIRouter, Query

router = APIRouter(prefix="/diagnoses")

@router.get("/recent")
def recent(limit: int = Query(20, ge=1, le=100)):
    # TODO: fetch from DB; stub for now
    data = [
        {"id": 1, "patient_id": 101, "disease": "tb", "created_at": "2025-01-01T00:00:00Z"},
    ]
    return data[:limit]
