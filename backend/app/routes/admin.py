from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from app.database import db_manager, get_db_status
from app.auth_utils import get_current_user

router = APIRouter(prefix="/api/admin", tags=["Administrator Management"])

class RoleUpdateRequest(BaseModel):
    role: str

@router.get("/users")
async def list_all_users(current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin privileges required")
    users_col = db_manager.get_collection("users")
    cursor = await users_col.find()
    users = await cursor.to_list()
    cleaned = []
    for u in users:
        item = dict(u)
        item["id"] = u.get("id") or str(u.get("_id"))
        item.pop("password_hash", None)
        cleaned.append(item)
    return cleaned

@router.put("/users/{user_id}/role")
async def update_user_role(user_id: str, body: RoleUpdateRequest, current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin privileges required")
    users_col = db_manager.get_collection("users")
    await users_col.update_one({"id": user_id}, {"$set": {"role": body.role}})
    return {"message": f"User role updated to {body.role}"}

@router.get("/system-health")
async def get_system_health():
    return {
        "status": "healthy",
        "service": "SkillBridge API Core",
        "version": "2.4.0",
        "db": get_db_status()
    }
