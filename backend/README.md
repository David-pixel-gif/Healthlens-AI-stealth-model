# Backend (FastAPI + MySQL)

- FastAPI app with modular routers and disease plug-in architecture.
- ONNXRuntime for inference; models are versioned under `app/ml/diseases/<key>/model/vX/`.
- Pydantic Settings for config, SQLAlchemy for DB, Alembic for migrations (stubs).

## Run (dev)

```bash
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Set environment variables via `.env` (see `.env.example`).
