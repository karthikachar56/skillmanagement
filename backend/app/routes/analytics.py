from collections import Counter
from fastapi import APIRouter
from app.database import db_manager, get_db_status

router = APIRouter(prefix="/api/analytics", tags=["Campus Skill Analytics"])

@router.get("/overview")
async def get_analytics_overview():
    users_col = db_manager.get_collection("users")
    certs_col = db_manager.get_collection("certificates")
    collabs_col = db_manager.get_collection("collaborations")
    opps_col = db_manager.get_collection("opportunities")
    
    users = await (await users_col.find()).to_list()
    certs = await (await certs_col.find()).to_list()
    collabs = await (await collabs_col.find()).to_list()
    opps = await (await opps_col.find()).to_list()
    
    students = [u for u in users if u.get("role") == "student"]
    faculty = [u for u in users if u.get("role") == "faculty"]
    recruiters = [u for u in users if u.get("role") == "recruiter"]
    
    # Skill frequency counter
    all_skills = []
    verified_skills = []
    dept_distribution = Counter()
    
    for s in students:
        dept = s.get("department", "Other")
        dept_distribution[dept] += 1
        for sk in s.get("skills", []):
            name = sk.get("name")
            if name:
                all_skills.append(name)
                if sk.get("verified"):
                    verified_skills.append(name)
                    
    skill_counter = Counter(all_skills)
    top_skills = [{"name": name, "count": count} for name, count in skill_counter.most_common(8)]
    
    verified_certs = sum(1 for c in certs if c.get("status") == "verified")
    pending_certs = sum(1 for c in certs if c.get("status") == "pending")
    active_collabs = sum(1 for c in collabs if c.get("status") == "accepted")
    
    return {
        "metrics": {
            "total_students": len(students),
            "total_faculty": len(faculty),
            "total_recruiters": len(recruiters),
            "total_verified_certificates": verified_certs,
            "pending_verifications": pending_certs,
            "active_collaborations": active_collabs,
            "total_opportunities": len(opps)
        },
        "top_trending_skills": top_skills,
        "department_distribution": [{"department": k, "students": v} for k, v in dept_distribution.items()],
        "db_status": get_db_status()
    }
