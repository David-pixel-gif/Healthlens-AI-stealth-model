# File: app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
import joblib
import warnings
from tensorflow.keras.models import load_model

# Routers
from app.routers.diagnoses import router as diagnoses_router
from app.routers.stats import router as stats_router
from app.routers.dashboard import router as dashboard_router
from app.routers.auth import router as auth_router
from app.routers.multi_disease_predictor import router as multi_predict_router

# Database init
from app.db.init_db import init_db

# -----------------------------------------------------
# ⚙️ Suppress common framework warnings
# -----------------------------------------------------
warnings.filterwarnings("ignore", category=UserWarning)
warnings.filterwarnings("ignore", category=FutureWarning)
warnings.filterwarnings("ignore", message="Trying to unpickle estimator")

# -----------------------------------------------------
# ✅ Initialize FastAPI app
# -----------------------------------------------------
app = FastAPI(title="HealthLens API")

# -----------------------------------------------------
# ✅ Allowed frontend origins (dev mode)
# -----------------------------------------------------
ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
]

# -----------------------------------------------------
# ✅ CORS Configuration
# -----------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------------------------------
# 🧠 Define model paths (absolute paths)
# -----------------------------------------------------
MODEL_PATHS = {
    "skin_cancer": r"C:\Users\jnthn\OneDrive\Desktop\new second half projects\HealthLens AI\backend\ml models\skin cancer models\model.h5",
    "brain_tumor": r"C:\Users\jnthn\OneDrive\Desktop\new second half projects\HealthLens AI\backend\ml models\brain tumor\model.h5",
    "malnutrition_model": r"C:\Users\jnthn\OneDrive\Desktop\new second half projects\HealthLens AI\backend\ml models\malnutrition models\malnutrition_risk_model.pkl",
    "malnutrition_scaler": r"C:\Users\jnthn\OneDrive\Desktop\new second half projects\HealthLens AI\backend\ml models\malnutrition models\feature_scaler.pkl",
}

# -----------------------------------------------------
# 🧩 Root Endpoint (Health Check)
# -----------------------------------------------------
@app.get("/")
def root():
    return {"service": "HealthLens API", "docs": "/docs"}

# -----------------------------------------------------
# 📦 Include Routers
# -----------------------------------------------------
app.include_router(dashboard_router)  # already has prefix="/api"
app.include_router(auth_router, prefix="/api", tags=["auth"])
app.include_router(diagnoses_router, prefix="/api", tags=["diagnoses"])
app.include_router(stats_router, prefix="/api", tags=["stats"])
app.include_router(multi_predict_router)

# -----------------------------------------------------
# 🚀 Startup Tasks
# -----------------------------------------------------
@app.on_event("startup")
def on_startup():
    """
    Runs when the app starts:
    - Initializes the database
    - Loads all ML models
    - Prints loaded models & registered routes
    """
    from os.path import exists
    import traceback

    # ---- 1. Initialize database ----
    print("📦 Initializing database...")
    init_db()
    print("✅ Database ready.\n")

    print("🚀 Starting HealthLens API...")

    # ---- 2. Load ML models ----
    app.state.models = {}

    def safe_load(name, loader, path):
        """Safely loads a model or scaler and logs its status."""
        try:
            # For Keras models, disable optimizer loading
            if path.endswith(".h5"):
                model = load_model(path, compile=False)  # ✅ skip optimizer state
            else:
                model = loader(path)

            app.state.models[name] = model
            print(f"✅ Loaded {name} successfully from:\n   {path}\n")

        except Exception as e:
            print(f"❌ Failed to load {name} at:\n   {path}\n   Error: {e}")
            traceback.print_exc()

    # Iterate through defined paths
    for key, path in MODEL_PATHS.items():
        if not exists(path):
            print(f"⚠️ Skipping {key}: file not found at {path}")
            continue

        if path.endswith(".h5"):
            safe_load(key, load_model, path)
        elif path.endswith(".pkl"):
            safe_load(key, joblib.load, path)
        else:
            print(f"⚠️ Unsupported model file format for {key}: {path}")

    # ---- 3. Print all loaded models ----
    print("🧠 Loaded Models Summary:")
    if app.state.models:
        for name in app.state.models.keys():
            print(f"   • {name}")
    else:
        print("   ⚠️ No models were loaded successfully!")
    print("-" * 60)

    # ---- 4. Print all registered routes ----
    print("📌 Registered Routes:")
    for route in app.router.routes:
        methods = ",".join(sorted(route.methods))
        print(f"   {methods:15s} {route.path}")
    print("-" * 60)

    print("✅ HealthLens API ready and serving at: http://127.0.0.1:8000\n")

# -----------------------------------------------------
# 💡 Notes:
# - app.state.models can be accessed anywhere in the app (e.g., in routes)
#   Example: model = request.app.state.models["skin_cancer"]
# - For production, consider moving model loading into a separate module.
# -----------------------------------------------------
