import json
import numpy as np
from typing import List

def softmax(logits: np.ndarray) -> np.ndarray:
    e = np.exp(logits - np.max(logits))
    return e / e.sum()

def load_labels(path) -> List[str]:
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)
