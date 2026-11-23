import os
from pathlib import Path
from dotenv import load_dotenv

# Automatically load .env from backend or root directory
backend_dir = Path(__file__).resolve().parent.parent
load_dotenv(backend_dir / ".env")
load_dotenv(backend_dir.parent / ".env")

MONGODB_URL = os.getenv("MONGODB_URL") or os.getenv("MONGODB_URI") or "mongodb://localhost:27017"
DB_NAME = os.getenv("DB_NAME", "skillbridge_db")
SECRET_KEY = os.getenv("SECRET_KEY", "skillbridge-dev-secret-key-2026-supersecure")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days
DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")
