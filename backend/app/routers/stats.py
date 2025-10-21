from fastapi import APIRouter, Query

router = APIRouter(prefix="/stats")

@router.get("/summary")
def summary(window: str = Query("today")):
    # TODO: replace with real numbers
    return {"window": window, "counts": {"total": 0, "today": 0}}
