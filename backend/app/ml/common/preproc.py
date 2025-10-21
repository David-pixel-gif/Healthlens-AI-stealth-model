import io
from typing import Tuple
from PIL import Image
import numpy as np

def load_image_rgb(file_bytes: bytes, size: Tuple[int, int]) -> np.ndarray:
    img = Image.open(io.BytesIO(file_bytes)).convert("RGB").resize(size)
    arr = np.asarray(img).astype("float32") / 255.0
    return np.transpose(arr, (2, 0, 1))
