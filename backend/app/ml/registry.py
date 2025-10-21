from typing import Dict, Type
from app.ml.common.interfaces import BaseDiseasePipeline

from app.ml.diseases.skin_cancer.pipeline import SkinCancerPipeline
from app.ml.diseases.brain_tumor.pipeline import BrainTumorPipeline
from app.ml.diseases.malnutrition.pipeline import MalnutritionPipeline
from app.ml.diseases.tb.pipeline import TbPipeline as TBPipeline if False else None  # type: ignore
from app.ml.diseases.tb.pipeline import TbPipeline as TBPipeline
from app.ml.diseases.malaria.pipeline import MalariaPipeline

REGISTRY: Dict[str, Type[BaseDiseasePipeline]] = {
    "skin_cancer": SkinCancerPipeline,
    "brain_tumor": BrainTumorPipeline,
    "malnutrition": MalnutritionPipeline,
    "tb": TBPipeline,
    "malaria": MalariaPipeline,
}
