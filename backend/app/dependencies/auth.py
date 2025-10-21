from fastapi import Depends
def get_current_user():
    # Stub: return a demo user payload.
    return {"id": 1, "email": "demo@user.com", "role": "clinician"}
