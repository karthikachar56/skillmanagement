from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class UserBase(BaseModel):
    email: str
    name: str
    role: str = "student" # student, faculty, recruiter, admin
    avatar: Optional[str] = None
    department: Optional[str] = "Computer Science & Engineering"
    semester: Optional[int] = 5
    srn: Optional[str] = None
    organization: Optional[str] = None
    title: Optional[str] = None
    bio: Optional[str] = None
    phone: Optional[str] = None
    whatsapp: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(UserBase):
    id: str
    created_at: Optional[str] = None

class SkillItem(BaseModel):
    id: Optional[str] = None
    name: str
    category: str = "technical" # technical, non_technical, design, data_ai, core
    proficiency: str = "intermediate" # beginner, intermediate, advanced
    verified: bool = False
    endorsements: int = 0

class ProjectItem(BaseModel):
    id: Optional[str] = None
    title: str
    description: str
    skills_used: List[str] = []
    live_url: Optional[str] = None
    github_url: Optional[str] = None
    role: Optional[str] = "Lead Developer"
    date: Optional[str] = None

class StudentProfileUpdate(BaseModel):
    name: Optional[str] = None
    bio: Optional[str] = None
    avatar: Optional[str] = None
    department: Optional[str] = None
    semester: Optional[int] = None
    srn: Optional[str] = None
    phone: Optional[str] = None
    whatsapp: Optional[str] = None
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    portfolio_url: Optional[str] = None
    organization: Optional[str] = None
    title: Optional[str] = None
    available_for_collaboration: Optional[bool] = None

class CertificateCreate(BaseModel):
    title: str
    issuer: str
    issue_date: str
    credential_url: Optional[str] = None
    certificate_type: str = "Course" # Course, Internship, Hackathon, Workshop, Professional
    skills_covered: List[str] = []

class CertificateReview(BaseModel):
    status: str # verified, rejected
    reviewer_notes: Optional[str] = None

class CollaborationCreate(BaseModel):
    receiver_id: str
    project_title: str
    role_needed: str
    message: str

class CollaborationStatusUpdate(BaseModel):
    status: str # accepted, declined

class OpportunityCreate(BaseModel):
    title: str
    organization: str
    type: str = "hackathon" # hackathon, internship, project, competition
    description: str
    required_skills: List[str] = []
    stipend_prize: Optional[str] = None
    deadline: Optional[str] = None
    location: Optional[str] = "Remote / Campus"

class ApplicationCreate(BaseModel):
    opportunity_id: str
    note: str
    portfolio_link: Optional[str] = None

class MessageCreate(BaseModel):
    receiver_id: str
    content: str

class TeamBuilderRequest(BaseModel):
    project_title: str
    description: str
    roles_needed: List[Dict[str, Any]] # e.g. [{"role": "Backend", "skills": ["Python", "FastAPI"], "proficiency": "intermediate"}]
