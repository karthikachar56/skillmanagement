import uuid
from datetime import datetime
from typing import Optional
from fastapi import APIRouter, HTTPException, Depends
from app.database import db_manager
from app.models import CollaborationCreate, CollaborationStatusUpdate, MessageCreate
from app.auth_utils import get_current_user

router = APIRouter(prefix="/api/collaborations", tags=["Collaboration Hub"])

@router.get("")
async def get_my_collaborations(current_user: dict = Depends(get_current_user)):
    collabs_col = db_manager.get_collection("collaborations")
    uid = current_user.get("id") or str(current_user.get("_id"))
    
    # Get requests where user is sender or receiver
    all_collabs = await (await collabs_col.find()).to_list()
    incoming = [c for c in all_collabs if c.get("receiver_id") == uid]
    outgoing = [c for c in all_collabs if c.get("sender_id") == uid]
    
    # Sort latest first
    incoming.sort(key=lambda x: x.get("created_at", ""), reverse=True)
    outgoing.sort(key=lambda x: x.get("created_at", ""), reverse=True)
    
    return {
        "incoming": incoming,
        "outgoing": outgoing,
        "total_active": sum(1 for c in incoming + outgoing if c.get("status") == "accepted")
    }

@router.post("")
async def send_collaboration_request(data: CollaborationCreate, current_user: dict = Depends(get_current_user)):
    users_col = db_manager.get_collection("users")
    collabs_col = db_manager.get_collection("collaborations")
    uid = current_user.get("id") or str(current_user.get("_id"))
    
    if uid == data.receiver_id:
        raise HTTPException(status_code=400, detail="Cannot send collaboration request to yourself")
        
    receiver = await users_col.find_one({"id": data.receiver_id})
    if not receiver:
        receiver = await users_col.find_one({"_id": data.receiver_id})
    if not receiver:
        raise HTTPException(status_code=404, detail="Target student not found")
        
    collab_id = str(uuid.uuid4())
    doc = {
        "id": collab_id,
        "sender_id": uid,
        "sender_name": current_user.get("name"),
        "sender_avatar": current_user.get("avatar"),
        "sender_dept": current_user.get("department", "Engineering"),
        "receiver_id": data.receiver_id,
        "receiver_name": receiver.get("name"),
        "receiver_avatar": receiver.get("avatar"),
        "project_title": data.project_title,
        "role_needed": data.role_needed,
        "message": data.message,
        "status": "pending",
        "created_at": datetime.utcnow().isoformat()
    }
    await collabs_col.insert_one(doc)
    return {"message": "Collaboration request sent successfully!", "collaboration": doc}

@router.put("/{collab_id}/status")
async def update_collaboration_status(collab_id: str, status_data: CollaborationStatusUpdate, current_user: dict = Depends(get_current_user)):
    collabs_col = db_manager.get_collection("collaborations")
    uid = current_user.get("id") or str(current_user.get("_id"))
    
    collab = await collabs_col.find_one({"id": collab_id})
    if not collab:
        raise HTTPException(status_code=404, detail="Collaboration request not found")
        
    if collab.get("receiver_id") != uid:
        raise HTTPException(status_code=403, detail="Only the recipient can accept or decline this request")
        
    await collabs_col.update_one({"id": collab_id}, {"$set": {"status": status_data.status}})
    updated = await collabs_col.find_one({"id": collab_id})
    return {"message": f"Request marked as {status_data.status}", "collaboration": updated}

@router.get("/{collab_id}/messages")
async def get_collaboration_messages(collab_id: str, current_user: dict = Depends(get_current_user)):
    messages_col = db_manager.get_collection("messages")
    cursor = await messages_col.find({"collab_id": collab_id})
    msgs = await cursor.to_list()
    msgs.sort(key=lambda x: x.get("timestamp", ""))
    return msgs

@router.post("/{collab_id}/messages")
async def send_collaboration_message(collab_id: str, msg: MessageCreate, current_user: dict = Depends(get_current_user)):
    messages_col = db_manager.get_collection("messages")
    uid = current_user.get("id") or str(current_user.get("_id"))
    
    doc = {
        "id": str(uuid.uuid4()),
        "collab_id": collab_id,
        "sender_id": uid,
        "sender_name": current_user.get("name"),
        "receiver_id": msg.receiver_id,
        "content": msg.content,
        "timestamp": datetime.utcnow().strftime("%H:%M | %b %d")
    }
    await messages_col.insert_one(doc)
    return doc
