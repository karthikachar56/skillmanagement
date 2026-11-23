import sys
from pathlib import Path

# Add backend directory to Python sys.path so app modules are discoverable
root_path = Path(__file__).resolve().parent.parent
backend_path = root_path / "backend"
sys.path.insert(0, str(backend_path))

from app.main import app
