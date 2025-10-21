# routers/diseases/__init__.py
from fastapi import APIRouter

from .tb import router as tb_router
from .malaria import router as malaria_router
from .skin_cancer import router as skin_cancer_router
from .brain_tumor import router as brain_tumor_router
from .malnutrition import router as malnutrition_router

router = APIRouter(prefix="/diseases", tags=["diseases"])

# This is the endpoint your UI wants: GET /api/diseases
@router.get("")  # NOTE: empty path so it matches /api/diseases (no trailing slash)
async def list_diseases():
    return [
        {"id": "tb",            "name": "Tuberculosis",  "path": "/api/diseases/tb"},
        {"id": "malaria",       "name": "Malaria",       "path": "/api/diseases/malaria"},
        {"id": "skin_cancer",   "name": "Skin Cancer",   "path": "/api/diseases/skin_cancer"},
        {"id": "brain_tumor",   "name": "Brain Tumor",   "path": "/api/diseases/brain_tumor"},
        {"id": "malnutrition",  "name": "Malnutrition",  "path": "/api/diseases/malnutrition"},
    ]

# Mount each disease-specific router under the collection
router.include_router(tb_router,           prefix="/tb")
router.include_router(malaria_router,      prefix="/malaria")
router.include_router(skin_cancer_router,  prefix="/skin_cancer")
router.include_router(brain_tumor_router,  prefix="/brain_tumor")
router.include_router(malnutrition_router, prefix="/malnutrition")
