from typing import Dict, Any, List, Optional
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from app.database import db_manager
from app.routes.students import calculate_credibility

router = APIRouter(prefix="/api/ai", tags=["AI Skill Intelligence & Team Builder"])

INDUSTRY_ROLE_PROFILES = {
    "Full-Stack AI Engineer": {
        "description": "Designs and ships end-to-end applications integrating generative AI, LLM backends, modern frontend, and scalable APIs.",
        "core_skills": ["Python", "FastAPI", "React", "Docker", "PyTorch", "System Design"],
        "recommended_certs": ["AWS Certified Solutions Architect", "DeepLearning.AI Generative AI Specialization"]
    },
    "Data Scientist & ML Engineer": {
        "description": "Extracts insights from structured/unstructured datasets, designs predictive neural nets, and deploys machine learning pipelines.",
        "core_skills": ["Python", "Scikit-learn", "TensorFlow", "PyTorch", "SQL", "Data Visualization"],
        "recommended_certs": ["Stanford Machine Learning Specialization", "TensorFlow Developer Certificate"]
    },
    "Mobile & UI/UX Product Designer": {
        "description": "Crafts human-centered mobile experiences, interactive Figma wireframes, and smooth cross-platform applications.",
        "core_skills": ["Figma", "UI/UX Design", "Flutter", "Kotlin", "Tailwind CSS"],
        "recommended_certs": ["Google UX Design Professional Certificate", "Meta Android Developer"]
    },
    "Cloud & DevOps Specialist": {
        "description": "Architects resilient multi-cloud architectures, CI/CD pipelines, container orchestration, and automated infrastructure.",
        "core_skills": ["Docker", "Kubernetes", "Linux", "Python", "System Design", "Cloud Security"],
        "recommended_certs": ["AWS Solutions Architect", "Certified Kubernetes Administrator (CKA)"]
    },
    "IoT & Embedded Hardware Engineer": {
        "description": "Bridges firmware with edge telemetry, low-power microcontrollers, circuit design, and wireless mesh networking.",
        "core_skills": ["C++", "Embedded Systems", "IoT", "Arduino", "Linux"],
        "recommended_certs": ["ARM Cortex-M Embedded Systems Engineering", "Embedded Linux Foundation"]
    }
}

class TeamRequest(BaseModel):
    project_title: str
    description: str
    roles: Optional[List[Dict[str, Any]]] = None

class SkillGapRequest(BaseModel):
    student_id: str
    target_role: str

@router.get("/roles")
async def get_industry_roles():
    """List available benchmark industry roles for skill gap analysis."""
    return [{"role": k, **v} for k, v in INDUSTRY_ROLE_PROFILES.items()]

@router.post("/skill-gap")
async def analyze_skill_gap(request: SkillGapRequest):
    users_col = db_manager.get_collection("users")
    certs_col = db_manager.get_collection("certificates")
    
    student = await users_col.find_one({"id": request.student_id})
    if not student:
        student = await users_col.find_one({"_id": request.student_id})
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
        
    role_info = INDUSTRY_ROLE_PROFILES.get(request.target_role)
    if not role_info:
        raise HTTPException(status_code=400, detail=f"Target role '{request.target_role}' not in benchmark catalog")
        
    required_skills = role_info["core_skills"]
    student_skills = {s["name"].lower(): s for s in student.get("skills", [])}
    
    acquired = []
    missing = []
    
    for r_skill in required_skills:
        lower_r = r_skill.lower()
        if lower_r in student_skills:
            acquired.append({
                "name": r_skill,
                "proficiency": student_skills[lower_r].get("proficiency", "intermediate"),
                "verified": student_skills[lower_r].get("verified", False),
                "endorsements": student_skills[lower_r].get("endorsements", 0)
            })
        else:
            missing.append(r_skill)
            
    match_percentage = round((len(acquired) / len(required_skills)) * 100) if required_skills else 100
    
    # Generate tailored recommendation roadmap
    learning_path = []
    for miss in missing[:3]:
        learning_path.append(f"Complete a hands-on project and verify a certificate in {miss}")
    learning_path.append("Engage in a campus hackathon team to apply skills in a collaborative setting")
    
    return {
        "student_id": request.student_id,
        "student_name": student.get("name"),
        "target_role": request.target_role,
        "role_description": role_info["description"],
        "match_percentage": match_percentage,
        "acquired_skills": acquired,
        "missing_skills": missing,
        "recommended_certifications": role_info["recommended_certs"],
        "recommended_action_steps": learning_path
    }

@router.post("/team-builder")
async def ai_team_builder(request: TeamRequest):
    """
    Intelligent team builder: Scans candidate pool, optimizes for role coverage,
    skill proficiency, verified credentials, and collaboration availability.
    """
    users_col = db_manager.get_collection("users")
    certs_col = db_manager.get_collection("certificates")
    
    cursor = await users_col.find({"role": "student"})
    all_students = await cursor.to_list()
    
    # Determine roles needed
    roles_needed = request.roles
    if not roles_needed:
        # Default balanced hackathon squad
        roles_needed = [
            {"role_name": "AI & Backend Lead", "required_skills": ["Python", "FastAPI", "PyTorch"]},
            {"role_name": "UI/UX & Mobile Designer", "required_skills": ["Figma", "UI/UX Design", "Kotlin", "Flutter", "Tailwind CSS"]},
            {"role_name": "Data & ML Engineer", "required_skills": ["Python", "Scikit-learn", "TensorFlow", "SQL"]},
            {"role_name": "Full Stack / Integration Developer", "required_skills": ["React", "JavaScript", "Node.js", "Docker"]}
        ]
        
    recommended_team = []
    used_student_ids = set()
    
    for r in roles_needed:
        role_name = r.get("role_name")
        req_skills = [s.lower() for s in r.get("required_skills", [])]
        
        best_candidate = None
        best_score = -1
        candidate_match_details = {}
        
        for s in all_students:
            s_id = s.get("id") or str(s.get("_id"))
            if s_id in used_student_ids:
                continue
                
            student_skills = s.get("skills", [])
            matches = [sk for sk in student_skills if sk.get("name", "").lower() in req_skills]
            if not matches:
                continue
                
            cert_count = await certs_col.count_documents({"student_id": s_id, "status": "verified"})
            cred = calculate_credibility(s, cert_count)
            
            # Match score formula
            skill_overlap_ratio = len(matches) / len(req_skills) if req_skills else 1
            score = (skill_overlap_ratio * 50) + (cred["score"] * 0.4)
            if s.get("available_for_collaboration"):
                score += 15
                
            if score > best_score:
                best_score = score
                best_candidate = s
                candidate_match_details = {
                    "matched_skills": [m["name"] for m in matches],
                    "overlap_percentage": round(skill_overlap_ratio * 100),
                    "credibility_score": cred["score"],
                    "badge": cred["badge"],
                    "match_affinity": round(min(score, 100), 1)
                }
                
        if best_candidate:
            cand_id = best_candidate.get("id") or str(best_candidate.get("_id"))
            used_student_ids.add(cand_id)
            recommended_team.append({
                "assigned_role": role_name,
                "student": {
                    "id": cand_id,
                    "name": best_candidate.get("name"),
                    "department": best_candidate.get("department"),
                    "semester": best_candidate.get("semester"),
                    "avatar": best_candidate.get("avatar"),
                    "bio": best_candidate.get("bio"),
                    "available": best_candidate.get("available_for_collaboration")
                },
                "match_metrics": candidate_match_details
            })
            
    # Compute overall team synergy
    avg_affinity = round(sum(m["match_metrics"]["match_affinity"] for m in recommended_team) / len(recommended_team), 1) if recommended_team else 0
    
    return {
        "project_title": request.project_title,
        "team_size": len(recommended_team),
        "overall_synergy_score": avg_affinity,
        "recommended_team": recommended_team
    }
