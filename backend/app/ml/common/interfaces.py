from abc import ABC, abstractmethod
from typing import Any, Dict

class BaseDiseasePipeline(ABC):
    name: str
    input_kind: str  # 'image' or 'tabular'
    version: str

    @abstractmethod
    def load(self) -> None:
        ...

    @abstractmethod
    def infer(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        ...

    def explain(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        return {"explainable": False}
