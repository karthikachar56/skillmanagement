import os
import shutil
from pathlib import Path
from dotenv import load_dotenv

# Automatically load .env from backend or root directory
backend_dir = Path(__file__).resolve().parent.parent
load_dotenv(backend_dir / ".env")
load_dotenv(backend_dir.parent / ".env")

DEFAULT_ATLAS_URI = "mongodb+srv://achark659_db_user:rulpRulZQf0qXWag@cluster0.lwab4au.mongodb.net/skillbridge_db?retryWrites=true&w=majority"
MONGODB_URL = os.getenv("MONGODB_URL") or os.getenv("MONGODB_URI") or DEFAULT_ATLAS_URI
DB_NAME = os.getenv("DB_NAME", "skillbridge_db")
SECRET_KEY = os.getenv("SECRET_KEY", "skillbridge-dev-secret-key-2026-supersecure")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

# Safe DATA_DIR handling for Vercel / serverless read-only environments
original_data_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")
def _is_serverless():
    return bool(
        os.environ.get("VERCEL")
        or os.environ.get("VERCEL_ENV")
        or os.environ.get("AWS_LAMBDA_FUNCTION_NAME")
        or os.environ.get("LAMBDA_TASK_ROOT")
        or not os.access(original_data_dir, os.W_OK)
    )

if _is_serverless():
    DATA_DIR = "/tmp/skillbridge_data"
    os.makedirs(DATA_DIR, exist_ok=True)
    if os.path.exists(original_data_dir):
        for fname in os.listdir(original_data_dir):
            src_file = os.path.join(original_data_dir, fname)
            dst_file = os.path.join(DATA_DIR, fname)
            if os.path.isfile(src_file) and not os.path.exists(dst_file):
                try:
                    shutil.copy2(src_file, dst_file)
                except Exception:
                    pass
else:
    DATA_DIR = original_data_dir
