import uuid
from datetime import datetime
from typing import Optional
from fastapi import APIRouter, HTTPException, Depends, Query
from app.database import db_manager
from app.models import OpportunityCreate, ApplicationCreate
from app.auth_utils import get_current_user

router = APIRouter(prefix="/api/opportunities", tags=["Project & Opportunity Marketplace"])

@router.get("")
async def list_opportunities(type: Optional[str] = Query(None)):
    opps_col = db_manager.get_collection("opportunities")
    query = {}
    if type:
        query["type"] = type
    cursor = await opps_col.find(query)
    opps = await cursor.to_list()
    opps.sort(key=lambda x: x.get("created_at", ""), reverse=True)
    return opps

@router.post("")
async def create_opportunity(data: OpportunityCreate, current_user: dict = Depends(get_current_user)):
    opps_col = db_manager.get_collection("opportunities")
    uid = current_user.get("id") or str(current_user.get("_id"))
    
    doc = {
        "id": str(uuid.uuid4()),
        "title": data.title,
        "organization": data.organization or current_user.get("organization") or current_user.get("name"),
        "posted_by_id": uid,
        "posted_by_name": current_user.get("name"),
        "type": data.type,
        "description": data.description,
        "required_skills": data.required_skills,
        "stipend_prize": data.stipend_prize or "Certificate & Networking",
        "deadline": data.deadline or "Open until filled",
        "location": data.location,
        "applications_count": 0,
        "created_at": datetime.utcnow().strftime("%Y-%m-%d")
    }
    await opps_col.insert_one(doc)
    return {"message": "Opportunity published successfully!", "opportunity": doc}

@router.post("/{opp_id}/apply")
async def apply_to_opportunity(opp_id: str, app_data: ApplicationCreate, current_user: dict = Depends(get_current_user)):
    opps_col = db_manager.get_collection("opportunities")
    apps_col = db_manager.get_collection("applications")
    uid = current_user.get("id") or str(current_user.get("_id"))
    
    opp = await opps_col.find_one({"id": opp_id})
    if not opp:
        raise HTTPException(status_code=404, detail="Opportunity not found")
        
    # Check if already applied
    existing = await apps_col.find_one({"opportunity_id": opp_id, "student_id": uid})
    if existing:
        raise HTTPException(status_code=400, detail="You have already applied to this opportunity")
        
    doc = {
        "id": str(uuid.uuid4()),
        "opportunity_id": opp_id,
        "opportunity_title": opp.get("title"),
        "student_id": uid,
        "student_name": current_user.get("name"),
        "student_email": current_user.get("email"),
        "student_department": current_user.get("department"),
        "student_semester": current_user.get("semester"),
        "note": app_data.note,
        "portfolio_link": app_data.portfolio_link,
        "status": "applied",
        "applied_at": datetime.utcnow().strftime("%Y-%m-%d %H:%M")
    }
    await apps_col.insert_one(doc)
    
    # Increment count
    await opps_col.update_one({"id": opp_id}, {"$set": {"applications_count": opp.get("applications_count", 0) + 1}})
    return {"message": "Application submitted successfully!", "application": doc}

@router.get("/{opp_id}/applications")
async def get_opportunity_applications(opp_id: str, current_user: dict = Depends(get_current_user)):
    opps_col = db_manager.get_collection("opportunities")
    apps_col = db_manager.get_collection("applications")
    
    opp = await opps_col.find_one({"id": opp_id})
    if not opp:
        raise HTTPException(status_code=404, detail="Opportunity not found")
        
    cursor = await apps_col.find({"opportunity_id": opp_id})
    return await cursor.to_list()
