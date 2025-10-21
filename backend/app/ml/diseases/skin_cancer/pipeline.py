from pathlib import Path
from typing import Any, Dict
import numpy as np
from app.ml.common.interfaces import BaseDiseasePipeline
from app.ml.common.preproc import load_image_rgb
from app.ml.common.postproc import softmax, load_labels

class SkinCancerPipeline(BaseDiseasePipeline):
    name = "skin_cancer"
    input_kind = "image"
    version = "v1"

    def __init__(self):
        here = Path(__file__).parent
        self.model_path = here / "model" / self.version / "model.onnx"
        self.labels = load_labels(here / "labels.json")
        self.input_size = (224, 224)
        self.session = None
        self.input_name = "input"
        self.output_name = "logits"

    def load(self) -> None:
        # NOTE: Model file is a placeholder in this scaffold.
        # Replace with a real ONNX model and ONNX Runtime session.
        self.session = None

    def infer(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        # Demo-only: generate fake logits so the API works end-to-end.
        _ = load_image_rgb(payload["file"], self.input_size)
        logits = np.random.randn(len(self.labels)).astype("float32")
        probs = softmax(logits)
        idx = int(np.argmax(probs))
        label = self.labels[idx]
        return {
            "label": label,
            "probs": {self.labels[i]: float(p) for i, p in enumerate(probs)},
            "meta": {"version": self.version}
        }
