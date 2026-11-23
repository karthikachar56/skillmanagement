import uuid
from typing import Optional, List
from fastapi import APIRouter, HTTPException, Depends
from app.database import db_manager
from app.models import SkillItem, ProjectItem, StudentProfileUpdate
from app.auth_utils import get_current_user

router = APIRouter(prefix="/api/students", tags=["Students"])

def calculate_credibility(student_doc: dict, verified_certs_count: int = 0) -> dict:
    skills = student_doc.get("skills", [])
    projects = student_doc.get("projects", [])
    
    cert_points = verified_certs_count * 20
    project_points = min(len(projects) * 15, 30)
    
    skill_points = 0
    endorsement_points = 0
    for s in skills:
        prof = s.get("proficiency", "beginner")
        if prof == "advanced":
            skill_points += 6
        elif prof == "intermediate":
            skill_points += 4
        else:
            skill_points += 2
            
        if s.get("verified"):
            skill_points += 5
        endorsement_points += min(s.get("endorsements", 0) * 2, 10)
        
    raw_total = cert_points + project_points + min(skill_points, 35) + min(endorsement_points, 15)
    normalized_score = min(max(raw_total, 10 if skills else 0), 100)
    
    badge = "Novice Talent"
    if normalized_score >= 85:
        badge = "Elite Campus Innovator"
    elif normalized_score >= 65:
        badge = "Distinguished Contributor"
    elif normalized_score >= 40:
        badge = "Verified Practitioner"
        
    return {
        "score": round(normalized_score),
        "badge": badge,
        "breakdown": {
            "verified_certificates": cert_points,
            "project_portfolio": project_points,
            "skill_depth": min(skill_points, 35),
            "peer_faculty_endorsements": min(endorsement_points, 15)
        }
    }

@router.get("")
async def list_students(department: Optional[str] = None, semester: Optional[int] = None):
    users_col = db_manager.get_collection("users")
    certs_col = db_manager.get_collection("certificates")
    
    query = {"role": "student"}
    if department:
        query["department"] = department
    if semester:
        query["semester"] = semester
        
    cursor = await users_col.find(query)
    students = await cursor.to_list()
    
    result = []
    for s in students:
        s_id = s.get("id") or str(s.get("_id"))
        cert_count = await certs_col.count_documents({"student_id": s_id, "status": "verified"})
        cred = calculate_credibility(s, cert_count)
        
        item = dict(s)
        item["id"] = s_id
        item.pop("password_hash", None)
        item["credibility"] = cred
        item["verified_certs_count"] = cert_count
        result.append(item)
        
    return result

@router.get("/{student_id}")
async def get_student_profile(student_id: str):
    users_col = db_manager.get_collection("users")
    certs_col = db_manager.get_collection("certificates")
    
    student = await users_col.find_one({"id": student_id})
    if not student:
        student = await users_col.find_one({"_id": student_id})
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found")
        
    # Increment profile view
    await users_col.update_one({"id": student_id}, {"$set": {"profile_views": student.get("profile_views", 0) + 1}})
    
    # Fetch verified & other certificates
    cursor = await certs_col.find({"student_id": student_id})
    certs = await cursor.to_list()
    verified_count = sum(1 for c in certs if c.get("status") == "verified")
    
    cred = calculate_credibility(student, verified_count)
    
    res = dict(student)
    res["id"] = student.get("id") or str(student.get("_id"))
    res.pop("password_hash", None)
    res["certificates"] = certs
    res["credibility"] = cred
    return res

@router.put("/profile")
async def update_profile(data: StudentProfileUpdate, current_user: dict = Depends(get_current_user)):
    users_col = db_manager.get_collection("users")
    uid = current_user.get("id") or str(current_user.get("_id"))
    
    updates = {}
    for k, v in data.dict(exclude_unset=True).items():
        if v is not None:
            updates[k] = v
            
    if "phone" in updates and "whatsapp" not in updates:
        updates["whatsapp"] = updates["phone"]
    if "whatsapp" in updates and "phone" not in updates:
        updates["phone"] = updates["whatsapp"]
        
    if updates:
        await users_col.update_one({"id": uid}, {"$set": updates})
        
    updated = await users_col.find_one({"id": uid})
    if not updated:
        updated = await users_col.find_one({"_id": uid})
    updated["id"] = uid
    updated.pop("password_hash", None)
    return updated

@router.post("/skills")
async def add_skill(skill: SkillItem, current_user: dict = Depends(get_current_user)):
    users_col = db_manager.get_collection("users")
    uid = current_user.get("id") or str(current_user.get("_id"))
    
    skills = current_user.get("skills", [])
    # Check if skill exists
    for s in skills:
        if s.get("name", "").lower() == skill.name.lower():
            s["proficiency"] = skill.proficiency
            s["category"] = skill.category
            break
    else:
        new_skill = {
            "name": skill.name.strip(),
            "category": skill.category,
            "proficiency": skill.proficiency,
            "verified": False,
            "endorsements": 0
        }
        skills.append(new_skill)
        
    await users_col.update_one({"id": uid}, {"$set": {"skills": skills}})
    return {"message": "Skill added successfully", "skills": skills}

@router.delete("/skills/{skill_name}")
async def delete_skill(skill_name: str, current_user: dict = Depends(get_current_user)):
    users_col = db_manager.get_collection("users")
    uid = current_user.get("id") or str(current_user.get("_id"))
    
    skills = [s for s in current_user.get("skills", []) if s.get("name", "").lower() != skill_name.lower()]
    await users_col.update_one({"id": uid}, {"$set": {"skills": skills}})
    return {"message": "Skill removed", "skills": skills}

@router.post("/projects")
async def add_project(project: ProjectItem, current_user: dict = Depends(get_current_user)):
    users_col = db_manager.get_collection("users")
    uid = current_user.get("id") or str(current_user.get("_id"))
    
    proj_doc = project.dict()
    proj_doc["id"] = str(uuid.uuid4())
    
    projects = current_user.get("projects", [])
    projects.append(proj_doc)
    
    await users_col.update_one({"id": uid}, {"$set": {"projects": projects}})
    return {"message": "Project added successfully", "project": proj_doc}

@router.delete("/projects/{project_id}")
async def delete_project(project_id: str, current_user: dict = Depends(get_current_user)):
    users_col = db_manager.get_collection("users")
    uid = current_user.get("id") or str(current_user.get("_id"))
    
    projects = [p for p in current_user.get("projects", []) if p.get("id") != project_id]
    await users_col.update_one({"id": uid}, {"$set": {"projects": projects}})
    return {"message": "Project deleted", "projects": projects}

@router.post("/endorse/{student_id}/{skill_name}")
async def endorse_skill(student_id: str, skill_name: str, current_user: dict = Depends(get_current_user)):
    users_col = db_manager.get_collection("users")
    student = await users_col.find_one({"id": student_id})
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
        
    skills = student.get("skills", [])
    endorsed = False
    for s in skills:
        if s.get("name", "").lower() == skill_name.lower():
            s["endorsements"] = s.get("endorsements", 0) + 1
            if current_user.get("role") in ["faculty", "admin"]:
                s["verified"] = True
            endorsed = True
            break
            
    if not endorsed:
        raise HTTPException(status_code=404, detail="Skill not found on student profile")
        
    await users_col.update_one({"id": student_id}, {"$set": {"skills": skills}})
    return {"message": f"Endorsed {skill_name} successfully!", "skills": skills}
