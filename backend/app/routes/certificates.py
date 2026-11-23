import uuid
from datetime import datetime
from typing import Optional
from fastapi import APIRouter, HTTPException, Depends
from app.database import db_manager
from app.models import CertificateCreate, CertificateReview
from app.auth_utils import get_current_user

router = APIRouter(prefix="/api/certificates", tags=["Certificates"])

@router.get("/my")
async def get_my_certificates(current_user: dict = Depends(get_current_user)):
    certs_col = db_manager.get_collection("certificates")
    uid = current_user.get("id") or str(current_user.get("_id"))
    cursor = await certs_col.find({"student_id": uid})
    return await cursor.to_list()

@router.get("/queue")
async def get_verification_queue(current_user: dict = Depends(get_current_user)):
    """Faculty & Admin view for reviewing pending and recent certificates."""
    certs_col = db_manager.get_collection("certificates")
    cursor = await certs_col.find()
    all_certs = await cursor.to_list()
    # Sort with pending first
    all_certs.sort(key=lambda x: (0 if x.get("status") == "pending" else 1, x.get("created_at", "")))
    return all_certs

@router.post("/upload")
async def upload_certificate(cert_data: CertificateCreate, current_user: dict = Depends(get_current_user)):
    certs_col = db_manager.get_collection("certificates")
    uid = current_user.get("id") or str(current_user.get("_id"))
    
    cert_id = str(uuid.uuid4())
    doc = {
        "id": cert_id,
        "student_id": uid,
        "student_name": current_user.get("name"),
        "student_srn": current_user.get("srn"),
        "title": cert_data.title,
        "issuer": cert_data.issuer,
        "issue_date": cert_data.issue_date,
        "credential_url": cert_data.credential_url,
        "certificate_type": cert_data.certificate_type,
        "skills_covered": cert_data.skills_covered,
        "status": "pending",
        "reviewer_notes": None,
        "reviewed_by": None,
        "reviewed_at": None,
        "created_at": datetime.utcnow().isoformat()
    }
    await certs_col.insert_one(doc)
    return {"message": "Certificate submitted for faculty verification", "certificate": doc}

@router.post("/{cert_id}/review")
async def review_certificate(cert_id: str, review: CertificateReview, current_user: dict = Depends(get_current_user)):
    if current_user.get("role") not in ["faculty", "admin"]:
        raise HTTPException(status_code=403, detail="Only faculty or administrators can verify certificates")
        
    certs_col = db_manager.get_collection("certificates")
    cert = await certs_col.find_one({"id": cert_id})
    if not cert:
        raise HTTPException(status_code=404, detail="Certificate not found")
        
    reviewer_name = current_user.get("name")
    now_str = datetime.utcnow().strftime("%Y-%m-%d %H:%M")
    
    update_data = {
        "status": review.status,
        "reviewer_notes": review.reviewer_notes or ("Approved by department faculty" if review.status == "verified" else "Requires resubmission"),
        "reviewed_by": reviewer_name,
        "reviewed_at": now_str
    }
    await certs_col.update_one({"id": cert_id}, {"$set": update_data})
    
    # If verified, automatically mark covered skills as verified on the student's profile!
    if review.status == "verified" and cert.get("skills_covered"):
        users_col = db_manager.get_collection("users")
        student = await users_col.find_one({"id": cert.get("student_id")})
        if student:
            skills = student.get("skills", [])
            covered_lower = [s.lower() for s in cert.get("skills_covered", [])]
            for s in skills:
                if s.get("name", "").lower() in covered_lower:
                    s["verified"] = True
            await users_col.update_one({"id": cert.get("student_id")}, {"$set": {"skills": skills}})
            
    updated_cert = await certs_col.find_one({"id": cert_id})
    return {"message": f"Certificate marked as {review.status}", "certificate": updated_cert}

@router.get("/stats")
async def get_cert_stats():
    certs_col = db_manager.get_collection("certificates")
    all_certs = await (await certs_col.find()).to_list()
    
    total = len(all_certs)
    verified = sum(1 for c in all_certs if c.get("status") == "verified")
    pending = sum(1 for c in all_certs if c.get("status") == "pending")
    rejected = sum(1 for c in all_certs if c.get("status") == "rejected")
    
    return {
        "total": total,
        "verified": verified,
        "pending": pending,
        "rejected": rejected,
        "verification_rate": round((verified / total * 100) if total > 0 else 0, 1)
    }
