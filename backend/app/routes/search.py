import re
from typing import Optional, List
from fastapi import APIRouter, Query
from app.database import db_manager
from app.routes.students import calculate_credibility

router = APIRouter(prefix="/api/search", tags=["Skill Discovery Engine"])

@router.get("/talents")
async def search_talents(
    q: Optional[str] = Query(None, description="General search keyword"),
    skills: Optional[str] = Query(None, description="Comma-separated skill names, e.g. Python,React"),
    proficiency: Optional[str] = Query(None, description="beginner, intermediate, or advanced"),
    department: Optional[str] = Query(None),
    semester: Optional[int] = Query(None),
    available_only: Optional[bool] = Query(False),
    min_credibility: Optional[int] = Query(0)
):
    users_col = db_manager.get_collection("users")
    certs_col = db_manager.get_collection("certificates")
    
    query = {"role": "student"}
    if department:
        query["department"] = department
    if semester:
        query["semester"] = semester
    if available_only:
        query["available_for_collaboration"] = True
        
    cursor = await users_col.find(query)
    students = await cursor.to_list()
    
    target_skills = [s.strip().lower() for s in skills.split(",")] if skills else []
    query_str = q.strip().lower() if q else ""
    
    results = []
    for s in students:
        s_id = s.get("id") or str(s.get("_id"))
        cert_count = await certs_col.count_documents({"student_id": s_id, "status": "verified"})
        cred = calculate_credibility(s, cert_count)
        
        if cred["score"] < (min_credibility or 0):
            continue
            
        student_skills = s.get("skills", [])
        student_skill_names = [sk.get("name", "").lower() for sk in student_skills]
        
        # Check target skill matches
        matched_skills = []
        if target_skills:
            for ts in target_skills:
                for sk in student_skills:
                    if ts in sk.get("name", "").lower():
                        if proficiency:
                            prof_order = {"beginner": 1, "intermediate": 2, "advanced": 3}
                            if prof_order.get(sk.get("proficiency", "beginner"), 1) >= prof_order.get(proficiency, 1):
                                matched_skills.append(sk["name"])
                        else:
                            matched_skills.append(sk["name"])
            if not matched_skills:
                continue
                
        # Keyword query match
        if query_str:
            bio_text = (s.get("bio") or "").lower()
            name_text = (s.get("name") or "").lower()
            dept_text = (s.get("department") or "").lower()
            project_titles = " ".join([p.get("title", "") for p in s.get("projects", [])]).lower()
            skills_text = " ".join(student_skill_names)
            
            combined = f"{name_text} {bio_text} {dept_text} {project_titles} {skills_text}"
            if query_str not in combined:
                continue
                
        # Calculate search match rank
        match_score = cred["score"]
        if target_skills:
            match_score += (len(set(matched_skills)) / len(target_skills)) * 50
        if s.get("available_for_collaboration"):
            match_score += 10
            
        item = dict(s)
        item["id"] = s_id
        item.pop("password_hash", None)
        item["credibility"] = cred
        item["verified_certs_count"] = cert_count
        item["matched_skills"] = list(set(matched_skills))
        item["match_score"] = round(match_score, 1)
        results.append(item)
        
    results.sort(key=lambda x: x["match_score"], reverse=True)
    return results
