# ================================================================
# File: app/routers/multi_disease_predictor.py
# Description: Unified prediction router for HealthLens API
# ================================================================

from fastapi import APIRouter, UploadFile, File, HTTPException, Request, Query
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from tensorflow.keras.preprocessing.image import img_to_array
from PIL import Image
import pandas as pd
import numpy as np
import tempfile
import os
import time

router = APIRouter(prefix="/api/predict", tags=["Multi-Disease Predictor"])

# ================================================================
# 🧩 Label Definitions
# ================================================================

SKIN_CLASS_NAMES = [
    "Actinic Keratosis",
    "Basal Cell Carcinoma",
    "Dermatofibroma",
    "Melanoma",
    "Nevus",
    "Pigmented Benign Keratosis",
    "Seborrheic Keratosis",
    "Squamous Cell Carcinoma",
    "Vascular Lesion"
]

BRAIN_CLASS_LABELS = ["glioma", "meningioma", "notumor", "pituitary"]
FRIENDLY_BRAIN_LABELS = {
    "glioma": "Glioma Tumor",
    "meningioma": "Meningioma Tumor",
    "notumor": "No Tumor",
    "pituitary": "Pituitary Tumor",
}

MALNUTRITION_DESCRIPTIONS = {
    "Low": "Minimal malnutrition risk.",
    "Moderate": "Moderate risk. Consider intervention.",
    "High": "High risk. Urgent intervention advised.",
    "Very High": "Critical risk. Immediate intervention required.",
}

# ================================================================
# 📊 Malnutrition Input Schema
# ================================================================
class MalnutritionInput(BaseModel):
    Stunting: float
    Wasting: float
    Underweight: float
    Overweight: float
    U5_Pop_Thousands: float


# ================================================================
# 🧠 Image Preprocessing Helper
# ================================================================
def preprocess_image(upload_file: UploadFile, size: tuple[int, int] = (256, 256), grayscale=False):
    """Load and preprocess image for prediction."""
    try:
        with tempfile.NamedTemporaryFile(delete=False) as tmp:
            tmp.write(upload_file.file.read())
            tmp_path = tmp.name

        img = Image.open(tmp_path)
        if grayscale:
            img = img.convert("L")
        else:
            img = img.convert("RGB")

        img = img.resize(size)
        img_array = img_to_array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)
        os.remove(tmp_path)
        return img_array
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Image preprocessing failed: {str(e)}")


# ================================================================
# 🧠 Brain Tumor Prediction
# ================================================================
@router.post("/brain-tumor")
async def predict_brain_tumor(request: Request, file: UploadFile = File(...)):
    """Predict brain tumor class from MRI image."""
    model = request.app.state.models.get("brain_tumor")
    if model is None:
        raise HTTPException(status_code=500, detail="Brain tumor model not loaded in app")

    img_array = preprocess_image(file, grayscale=True)
    try:
        start = time.time()
        preds = model.predict(img_array, verbose=0)[0]
        idx = np.argmax(preds)
        raw_label = BRAIN_CLASS_LABELS[idx]
        confidence = float(preds[idx])
        elapsed = time.time() - start

        return {
            "diagnosis": FRIENDLY_BRAIN_LABELS[raw_label],
            "confidence": f"{confidence * 100:.2f}%",
            "processing_time": f"{elapsed:.2f}s",
            "class_probabilities": {
                FRIENDLY_BRAIN_LABELS[label]: f"{p * 100:.2f}%" for label, p in zip(BRAIN_CLASS_LABELS, preds)
            }
        }
    except Exception as e:
        logger.error(f"Brain tumor prediction failed: {e}")
        raise HTTPException(status_code=500, detail="Prediction error")


# ================================================================
# 🩺 Skin Cancer Prediction
# ================================================================
@router.post("/skin-cancer")
async def predict_skin_cancer(request: Request, file: UploadFile = File(...)):
    """Predict skin cancer type from lesion image."""
    model = request.app.state.models.get("skin_cancer")
    if model is None:
        raise HTTPException(status_code=500, detail="Skin cancer model not loaded in app")

    img_array = preprocess_image(file, grayscale=False)
    try:
        preds = model.predict(img_array, verbose=0)[0]
        idx = np.argmax(preds)
        diagnosis = SKIN_CLASS_NAMES[idx]
        confidence = float(preds[idx])

        return {
            "diagnosis": diagnosis,
            "confidence": f"{confidence * 100:.2f}%",
            "class_probabilities": {
                SKIN_CLASS_NAMES[i]: f"{p * 100:.2f}%" for i, p in enumerate(preds)
            }
        }
    except Exception as e:
        logger.error(f"Skin cancer prediction failed: {e}")
        raise HTTPException(status_code=500, detail="Prediction error")


# ================================================================
# 🧮 Malnutrition Risk Prediction
# ================================================================
@router.post("/malnutrition")
def predict_malnutrition(request: Request, data: MalnutritionInput):
    """Predict malnutrition risk level based on anthropometric data."""
    model = request.app.state.models.get("malnutrition_model")
    scaler = request.app.state.models.get("malnutrition_scaler")

    if model is None or scaler is None:
        raise HTTPException(status_code=500, detail="Malnutrition model or scaler not loaded in app")

    try:
        df = pd.DataFrame([data.dict()])
        X_scaled = scaler.transform(df)
        prediction = model.predict(X_scaled)[0]

        return {
            "input": data.dict(),
            "predicted_risk_level": prediction,
            "description": MALNUTRITION_DESCRIPTIONS.get(prediction, "No description available.")
        }
    except Exception as e:
        logger.error(f"Malnutrition prediction failed: {e}")
        raise HTTPException(status_code=500, detail="Prediction error")


# ================================================================
# 🔍 Health Check Endpoint
# ================================================================
@router.get("/status")
def model_status(request: Request):
    """Return which models are loaded in app state."""
    models_state = request.app.state.models
    return {
        "brain_tumor_model_loaded": "brain_tumor" in models_state,
        "skin_cancer_model_loaded": "skin_cancer" in models_state,
        "malnutrition_model_loaded": "malnutrition_model" in models_state,
        "scaler_loaded": "malnutrition_scaler" in models_state,
    }
