# File: app/db/init_db.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.db.session import Base
from app.models import user, patient  # import all models so metadata is aware

# SQLite database
DATABASE_URL = "sqlite:///./local.db"

engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def init_db():
    """Initialize database: create tables if they don't exist."""
    print("📦 Initializing database...")
    Base.metadata.create_all(bind=engine)
    print("✅ Database ready.")
