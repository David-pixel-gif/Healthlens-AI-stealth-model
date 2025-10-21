from fastapi import APIRouter, File, UploadFile, Depends, HTTPException
from typing import Dict
from app.dependencies.auth import get_current_user
from app.ml.registry import REGISTRY

router = APIRouter(prefix="/diseases/tb", tags=["tb"])

_pipeline = None

def get_pipeline():
    global _pipeline
    if _pipeline is None:
        cls = REGISTRY["tb"]
        pipeline = cls()
        pipeline.load()
        _pipeline = pipeline
    return _pipeline

@router.post("/infer")
async def infer_image(file: UploadFile = File(...), user=Depends(get_current_user)) -> Dict:
    if file.content_type not in {"image/jpeg", "image/png"}:
        raise HTTPException(status_code=400, detail="Only JPEG/PNG supported")
    data = await file.read()
    out = get_pipeline().infer({"file": data})
    return out
