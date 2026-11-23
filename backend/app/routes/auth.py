import uuid
from datetime import datetime
from fastapi import APIRouter, HTTPException, Depends
from app.database import db_manager
from app.models import UserCreate, UserLogin, UserResponse
from app.auth_utils import hash_password, verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/register")
async def register(user_data: UserCreate):
    users_col = db_manager.get_collection("users")
    existing = await users_col.find_one({"email": user_data.email.lower()})
    if existing:
        raise HTTPException(
            status_code=400, 
            detail="An account with this email already exists. Please switch to the Sign In tab (default password: password123)."
        )

    user_id = str(uuid.uuid4())
    doc = {
        "id": user_id,
        "email": user_data.email.lower(),
        "password_hash": hash_password(user_data.password),
        "name": user_data.name,
        "role": user_data.role,
        "avatar": user_data.avatar or f"https://api.dicebear.com/7.x/bottts/svg?seed={user_data.name}",
        "department": user_data.department or "Computer Science & Engineering",
        "semester": user_data.semester or 1,
        "srn": user_data.srn or f"PES2UG25{user_data.role[:2].upper()}{uuid.uuid4().hex[:4].upper()}",
        "bio": user_data.bio or f"Hello, I am {user_data.name} on SkillBridge.",
        "phone": user_data.phone or user_data.whatsapp,
        "whatsapp": user_data.whatsapp or user_data.phone,
        "skills": [],
        "projects": [],
        "available_for_collaboration": True,
        "profile_views": 0,
        "organization": user_data.organization or ("University Campus" if user_data.role == "faculty" else None),
        "title": user_data.title or ("Mentor" if user_data.role == "faculty" else None),
        "created_at": datetime.utcnow().isoformat()
    }
    try:
        await users_col.insert_one(doc)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Registration failed: {str(e)}")
    
    token = create_access_token({"sub": user_id, "role": doc["role"]})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user_id,
            "email": doc["email"],
            "name": doc["name"],
            "role": doc["role"],
            "department": doc.get("department"),
            "semester": doc.get("semester"),
            "avatar": doc.get("avatar"),
            "phone": doc.get("phone"),
            "whatsapp": doc.get("whatsapp")
        }
    }

@router.post("/login")
async def login(credentials: UserLogin):
    users_col = db_manager.get_collection("users")
    user = await users_col.find_one({"email": credentials.email.lower()})
    if not user:
        raise HTTPException(status_code=400, detail="Invalid email or password")
    
    if not verify_password(credentials.password, user.get("password_hash", "")):
        raise HTTPException(status_code=400, detail="Invalid email or password")
        
    uid = user.get("id") or str(user.get("_id"))
    token = create_access_token({"sub": uid, "role": user.get("role")})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": uid,
            "email": user["email"],
            "name": user["name"],
            "role": user["role"],
            "department": user.get("department"),
            "semester": user.get("semester"),
            "avatar": user.get("avatar")
        }
    }

@router.get("/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    user = dict(current_user)
    user["id"] = user.get("id") or str(user.get("_id"))
    user.pop("password_hash", None)
    return user

@router.get("/demo-users")
async def get_demo_users():
    """List available pre-configured demo users for instant 1-click login and testing across all 4 roles."""
    users_col = db_manager.get_collection("users")
    cursor = await users_col.find()
    users = await cursor.to_list()
    demo_list = []
    for u in users:
        demo_list.append({
            "id": u.get("id") or str(u.get("_id")),
            "email": u.get("email"),
            "name": u.get("name"),
            "role": u.get("role"),
            "title": u.get("title") or u.get("department"),
            "avatar": u.get("avatar")
        })
    return demo_list

@router.post("/demo-login/{user_id}")
async def demo_login(user_id: str):
    """Instant login endpoint for rapid switching during demonstrations."""
    users_col = db_manager.get_collection("users")
    user = await users_col.find_one({"id": user_id})
    if not user:
        user = await users_col.find_one({"_id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="Demo user not found")
        
    uid = user.get("id") or str(user.get("_id"))
    token = create_access_token({"sub": uid, "role": user.get("role")})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": uid,
            "email": user["email"],
            "name": user["name"],
            "role": user["role"],
            "department": user.get("department"),
            "semester": user.get("semester"),
            "avatar": user.get("avatar")
        }
    }
