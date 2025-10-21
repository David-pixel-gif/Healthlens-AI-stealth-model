# File: app/db/session.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Using SQLite for now — change to Postgres/MySQL URI if needed
DATABASE_URL = "sqlite:///./local.db"

engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


# Dependency for FastAPI routes
def get_db():
    """Provide a SQLAlchemy session for request and close after use."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
