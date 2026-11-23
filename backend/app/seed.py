import asyncio
from datetime import datetime
from app.database import db_manager
from app.auth_utils import hash_password

SEED_USERS = [
    {
        "id": "student-1",
        "email": "alex.chen@campus.edu",
        "name": "Alex Chen",
        "role": "student",
        "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces",
        "department": "Computer Science & Engineering",
        "semester": 6,
        "srn": "PES2UG22CS042",
        "phone": "+91 98765 43210",
        "whatsapp": "+919876543210",
        "bio": "Full-stack AI developer passionate about high-performance distributed systems and autonomous agents. Open for hackathons and ambitious web/AI builds.",
        "github_url": "https://github.com/alexchen-dev",
        "linkedin_url": "https://linkedin.com/in/alexchen",
        "portfolio_url": "https://alexchen.dev",
        "available_for_collaboration": True,
        "profile_views": 142,
        "skills": [
            {"name": "Python", "category": "technical", "proficiency": "advanced", "verified": True, "endorsements": 8},
            {"name": "FastAPI", "category": "technical", "proficiency": "advanced", "verified": True, "endorsements": 6},
            {"name": "React", "category": "technical", "proficiency": "intermediate", "verified": True, "endorsements": 5},
            {"name": "Docker", "category": "technical", "proficiency": "intermediate", "verified": False, "endorsements": 3},
            {"name": "PyTorch", "category": "data_ai", "proficiency": "intermediate", "verified": True, "endorsements": 4},
            {"name": "System Design", "category": "technical", "proficiency": "intermediate", "verified": False, "endorsements": 2},
            {"name": "Leadership", "category": "non_technical", "proficiency": "advanced", "verified": True, "endorsements": 7}
        ],
        "projects": [
            {
                "id": "proj-1",
                "title": "Agentic Campus Assistant",
                "description": "Multi-agent autonomous scheduling and query engine using FastAPI and LangChain with vector search over campus syllabi.",
                "skills_used": ["Python", "FastAPI", "PyTorch", "Docker"],
                "live_url": "https://agentic-campus.demo.app",
                "github_url": "https://github.com/alexchen-dev/campus-agent",
                "role": "Lead System Architect",
                "date": "Oct 2025"
            },
            {
                "id": "proj-2",
                "title": "Realtime Code Collab",
                "description": "Browser-based collaborative code editor with operational transforms and WebSockets for paired programming.",
                "skills_used": ["React", "FastAPI", "Docker"],
                "live_url": "https://code-collab-realtime.app",
                "github_url": "https://github.com/alexchen-dev/code-collab",
                "role": "Full Stack Engineer",
                "date": "Jan 2026"
            }
        ]
    },
    {
        "id": "student-2",
        "email": "priya.patel@campus.edu",
        "name": "Priya Patel",
        "role": "student",
        "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=faces",
        "department": "Information Science & Engineering",
        "semester": 6,
        "srn": "PES2UG22IS118",
        "bio": "Product designer and mobile application engineer. I turn complex logic into intuitive user experiences and silky-smooth micro-interactions.",
        "github_url": "https://github.com/priyapatel-ui",
        "linkedin_url": "https://linkedin.com/in/priyapatel-design",
        "portfolio_url": "https://priyapatel.design",
        "available_for_collaboration": True,
        "profile_views": 189,
        "skills": [
            {"name": "Figma", "category": "design", "proficiency": "advanced", "verified": True, "endorsements": 11},
            {"name": "UI/UX Design", "category": "design", "proficiency": "advanced", "verified": True, "endorsements": 9},
            {"name": "Kotlin", "category": "technical", "proficiency": "intermediate", "verified": True, "endorsements": 4},
            {"name": "Flutter", "category": "technical", "proficiency": "intermediate", "verified": False, "endorsements": 5},
            {"name": "Tailwind CSS", "category": "technical", "proficiency": "advanced", "verified": True, "endorsements": 8},
            {"name": "Public Speaking", "category": "non_technical", "proficiency": "advanced", "verified": False, "endorsements": 4}
        ],
        "projects": [
            {
                "id": "proj-3",
                "title": "Pulse Fitness App",
                "description": "Clean, accessible mobile companion app featuring health metric tracking, gamified goals, and offline caching.",
                "skills_used": ["Figma", "Kotlin", "UI/UX Design"],
                "live_url": "https://pulse-fit.preview.app",
                "github_url": "https://github.com/priyapatel-ui/pulse-fitness",
                "role": "Lead Mobile & UI Designer",
                "date": "Nov 2025"
            }
        ]
    },
    {
        "id": "student-3",
        "email": "marcus.johnson@campus.edu",
        "name": "Marcus Johnson",
        "role": "student",
        "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces",
        "department": "Artificial Intelligence & Data Science",
        "semester": 4,
        "srn": "PES2UG23AI089",
        "bio": "Data enthusiast working on computer vision, NLP transformers, and predictive modeling. Seeking backend and frontend partners for upcoming AI challenges.",
        "github_url": "https://github.com/marcusj-ai",
        "linkedin_url": "https://linkedin.com/in/marcusjohnson-ds",
        "portfolio_url": "https://marcus.ai-portfolio.com",
        "available_for_collaboration": True,
        "profile_views": 96,
        "skills": [
            {"name": "Python", "category": "technical", "proficiency": "advanced", "verified": True, "endorsements": 7},
            {"name": "Scikit-learn", "category": "data_ai", "proficiency": "advanced", "verified": True, "endorsements": 5},
            {"name": "TensorFlow", "category": "data_ai", "proficiency": "intermediate", "verified": False, "endorsements": 3},
            {"name": "SQL", "category": "technical", "proficiency": "intermediate", "verified": True, "endorsements": 6},
            {"name": "Data Visualization", "category": "data_ai", "proficiency": "intermediate", "verified": False, "endorsements": 2}
        ],
        "projects": [
            {
                "id": "proj-4",
                "title": "Automated Medical X-Ray Screener",
                "description": "Deep Convolutional Neural Network pipeline achieving 94.2% ROC-AUC in detecting pulmonary consolidations on public datasets.",
                "skills_used": ["Python", "TensorFlow", "Scikit-learn"],
                "live_url": "https://huggingface.co/spaces/marcus-ai/xray-screener",
                "github_url": "https://github.com/marcusj-ai/med-screener",
                "role": "ML Research Contributor",
                "date": "Dec 2025"
            }
        ]
    },
    {
        "id": "student-4",
        "email": "sarah.mansoor@campus.edu",
        "name": "Sarah Al-Mansoor",
        "role": "student",
        "avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=faces",
        "department": "Electronics & Communication Engineering",
        "semester": 6,
        "srn": "PES2UG22EC055",
        "bio": "Embedded systems tinkerer and hardware IoT engineer. Specializing in low-power microcontrollers, MQTT telemetry, and edge computing.",
        "github_url": "https://github.com/sarah-embedded",
        "linkedin_url": "https://linkedin.com/in/sarahmansoor",
        "portfolio_url": "https://sarah-iot.tech",
        "available_for_collaboration": False,
        "profile_views": 75,
        "skills": [
            {"name": "C++", "category": "technical", "proficiency": "advanced", "verified": True, "endorsements": 9},
            {"name": "Embedded Systems", "category": "core", "proficiency": "advanced", "verified": True, "endorsements": 8},
            {"name": "IoT", "category": "technical", "proficiency": "advanced", "verified": True, "endorsements": 6},
            {"name": "Arduino", "category": "core", "proficiency": "intermediate", "verified": False, "endorsements": 4},
            {"name": "Communication", "category": "non_technical", "proficiency": "intermediate", "verified": False, "endorsements": 3}
        ],
        "projects": [
            {
                "id": "proj-5",
                "title": "LoRaWAN Smart Agrisensor Mesh",
                "description": "Solar-powered telemetry node mesh transmitting soil salinity and microclimate stats over 8km without cellular towers.",
                "skills_used": ["C++", "Embedded Systems", "IoT"],
                "live_url": "https://agri-mesh.iot.io",
                "github_url": "https://github.com/sarah-embedded/agri-lora",
                "role": "Firmware & Circuit Lead",
                "date": "Aug 2025"
            }
        ]
    },
    {
        "id": "student-5",
        "email": "rahul.verma@campus.edu",
        "name": "Rahul Verma",
        "role": "student",
        "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=faces",
        "department": "Computer Science & Engineering",
        "semester": 4,
        "srn": "PES2UG23CS201",
        "bio": "Curious sophomore eager to join hackathon teams. Building modern web stacks with Node, React, and MongoDB.",
        "github_url": "https://github.com/rahulverma-web",
        "linkedin_url": "https://linkedin.com/in/rahulverma",
        "portfolio_url": "https://rahulverma.dev",
        "available_for_collaboration": True,
        "profile_views": 52,
        "skills": [
            {"name": "JavaScript", "category": "technical", "proficiency": "intermediate", "verified": True, "endorsements": 4},
            {"name": "Node.js", "category": "technical", "proficiency": "intermediate", "verified": False, "endorsements": 2},
            {"name": "MongoDB", "category": "technical", "proficiency": "intermediate", "verified": False, "endorsements": 3},
            {"name": "Tailwind CSS", "category": "technical", "proficiency": "intermediate", "verified": False, "endorsements": 1}
        ],
        "projects": [
            {
                "id": "proj-6",
                "title": "Campus Club Event Hub",
                "description": "Event ticketing and attendance QR tracker used by 3 campus engineering clubs.",
                "skills_used": ["JavaScript", "Node.js", "MongoDB"],
                "live_url": "https://campus-hub.vercel.app",
                "github_url": "https://github.com/rahulverma-web/event-hub",
                "role": "Full Stack Developer",
                "date": "Jan 2026"
            }
        ]
    },
    {
        "id": "faculty-1",
        "email": "dr.sharma@campus.edu",
        "name": "Dr. Ramesh Sharma",
        "role": "faculty",
        "avatar": "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=faces",
        "department": "Computer Science & Engineering",
        "title": "Professor & Head of Department",
        "bio": "Mentoring high-impact student research groups, verifying technical achievements, and connecting promising talents with premier research labs."
    },
    {
        "id": "faculty-2",
        "email": "dr.ananya@campus.edu",
        "name": "Prof. Ananya Iyer",
        "role": "faculty",
        "avatar": "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&h=200&fit=crop&crop=faces",
        "department": "Artificial Intelligence & Data Science",
        "title": "Associate Professor & Hackathon Advisor",
        "bio": "Guiding AI innovation projects and evaluating technical certificates and hackathon proof of works."
    },
    {
        "id": "recruiter-1",
        "email": "recruiter@techcorp.io",
        "name": "David Miller",
        "role": "recruiter",
        "avatar": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&crop=faces",
        "organization": "Nexus Tech Innovation Labs",
        "title": "Lead Talent Scout",
        "bio": "Sourcing passionate student creators and engineers for high-impact summer research internships and venture-backed fellowships."
    },
    {
        "id": "admin-1",
        "email": "admin@skillbridge.edu",
        "name": "SkillBridge Central Admin",
        "role": "admin",
        "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=faces",
        "organization": "University Skills & Placements Directorate",
        "title": "Platform Administrator",
        "bio": "Managing campus-wide student talent directory, faculty verification workflows, and cross-departmental analytics."
    }
]

SEED_CERTIFICATES = [
    {
        "id": "cert-1",
        "student_id": "student-1",
        "student_name": "Alex Chen",
        "student_srn": "PES2UG22CS042",
        "title": "AWS Certified Solutions Architect - Associate",
        "issuer": "Amazon Web Services",
        "issue_date": "2025-08-15",
        "credential_url": "https://aws.amazon.com/verification/AWS-SAA-839211",
        "certificate_type": "Professional",
        "skills_covered": ["Docker", "FastAPI", "System Design"],
        "status": "verified",
        "reviewer_notes": "Official credential ID checked and validated on AWS public badge portal. Excellent accomplishment.",
        "reviewed_by": "Dr. Ramesh Sharma",
        "reviewed_at": "2025-08-20"
    },
    {
        "id": "cert-2",
        "student_id": "student-1",
        "student_name": "Alex Chen",
        "student_srn": "PES2UG22CS042",
        "title": "Deep Learning Specialization (5 Courses)",
        "issuer": "DeepLearning.AI / Coursera",
        "issue_date": "2025-11-10",
        "credential_url": "https://coursera.org/verify/specialization/DL-SPECIAL-9912",
        "certificate_type": "Course",
        "skills_covered": ["Python", "PyTorch"],
        "status": "verified",
        "reviewer_notes": "Certificate verified via Coursera authentic token URL.",
        "reviewed_by": "Prof. Ananya Iyer",
        "reviewed_at": "2025-11-14"
    },
    {
        "id": "cert-3",
        "student_id": "student-2",
        "student_name": "Priya Patel",
        "student_srn": "PES2UG22IS118",
        "title": "Google UX Design Professional Certificate",
        "issuer": "Google",
        "issue_date": "2025-07-22",
        "credential_url": "https://coursera.org/verify/professional-cert/GOOGLE-UX-4821",
        "certificate_type": "Professional",
        "skills_covered": ["Figma", "UI/UX Design"],
        "status": "verified",
        "reviewer_notes": "Comprehensive 7-course sequence confirmed with verified portfolio artifacts.",
        "reviewed_by": "Dr. Ramesh Sharma",
        "reviewed_at": "2025-07-28"
    },
    {
        "id": "cert-4",
        "student_id": "student-3",
        "student_name": "Marcus Johnson",
        "student_srn": "PES2UG23AI089",
        "title": "Machine Learning with Python & Scikit-Learn",
        "issuer": "Stanford Online",
        "issue_date": "2026-01-18",
        "credential_url": "https://online.stanford.edu/verify/ML-STANFORD-2026",
        "certificate_type": "Course",
        "skills_covered": ["Python", "Scikit-learn"],
        "status": "pending",
        "reviewer_notes": None,
        "reviewed_by": None,
        "reviewed_at": None
    },
    {
        "id": "cert-5",
        "student_id": "student-5",
        "student_name": "Rahul Verma",
        "student_srn": "PES2UG23CS201",
        "title": "Full Stack Web Developer Bootcamp",
        "issuer": "Udemy Academy",
        "issue_date": "2026-02-01",
        "credential_url": "https://udemy.com/certificate/UC-99182312",
        "certificate_type": "Course",
        "skills_covered": ["JavaScript", "Node.js", "MongoDB"],
        "status": "pending",
        "reviewer_notes": None,
        "reviewed_by": None,
        "reviewed_at": None
    },
    {
        "id": "cert-6",
        "student_id": "student-4",
        "student_name": "Sarah Al-Mansoor",
        "student_srn": "PES2UG22EC055",
        "title": "ARM Cortex-M Embedded Systems Engineering",
        "issuer": "ARM Education Program",
        "issue_date": "2025-09-12",
        "credential_url": "https://arm.com/verify/cert/ARM-M4-883",
        "certificate_type": "Professional",
        "skills_covered": ["C++", "Embedded Systems", "IoT"],
        "status": "verified",
        "reviewer_notes": "Lab hardware evaluation passed and verified.",
        "reviewed_by": "Dr. Ramesh Sharma",
        "reviewed_at": "2025-09-18"
    }
]

SEED_COLLABORATIONS = [
    {
        "id": "collab-1",
        "sender_id": "student-3",
        "sender_name": "Marcus Johnson",
        "sender_dept": "AI & Data Science",
        "receiver_id": "student-1",
        "receiver_name": "Alex Chen",
        "project_title": "Autonomous Drone Vision Pipeline",
        "role_needed": "FastAPI & Microservices Engineer",
        "message": "Hey Alex! I saw your projects in distributed systems and FastAPI. I have a working PyTorch model for object tracking and need a robust API layer for drone video ingestion. Would love to team up!",
        "status": "accepted",
        "created_at": "2026-02-10T14:30:00"
    },
    {
        "id": "collab-2",
        "sender_id": "student-1",
        "sender_name": "Alex Chen",
        "sender_dept": "Computer Science & Engineering",
        "receiver_id": "student-2",
        "receiver_name": "Priya Patel",
        "project_title": "Smart Campus AI Hackathon 2026",
        "role_needed": "Lead UI/UX & Mobile Designer",
        "message": "Hi Priya, our hackathon team has backend and data science covered, but we urgently need your Figma and Kotlin/Flutter mastery for the frontend presentation. Let's win this!",
        "status": "pending",
        "created_at": "2026-02-14T10:15:00"
    },
    {
        "id": "collab-3",
        "sender_id": "student-5",
        "sender_name": "Rahul Verma",
        "sender_dept": "Computer Science & Engineering",
        "receiver_id": "student-2",
        "receiver_name": "Priya Patel",
        "project_title": "Club Portal Redesign",
        "role_needed": "Design Reviewer / Mentor",
        "message": "Hey Priya, could you review our student club portal wireframes and help us polish the user flow?",
        "status": "pending",
        "created_at": "2026-02-18T16:00:00"
    }
]

SEED_OPPORTUNITIES = [
    {
        "id": "opp-1",
        "title": "National Smart Campus AI Hackathon 2026",
        "organization": "University Innovation Council & Nexus",
        "posted_by_id": "recruiter-1",
        "posted_by_name": "David Miller",
        "type": "hackathon",
        "description": "48-hour intensive hackathon aimed at building agentic automation for university administration, student wellness, and laboratory equipment sharing. Teams of 3-4 required.",
        "required_skills": ["Python", "React", "UI/UX Design", "PyTorch", "FastAPI"],
        "stipend_prize": "$3,000 Cash Prize + Incubation Grant",
        "deadline": "2026-04-15",
        "location": "Main Auditorium / Hybrid",
        "applications_count": 8,
        "created_at": "2026-02-01"
    },
    {
        "id": "opp-2",
        "title": "Full-Stack AI Summer Research Intern",
        "organization": "Nexus Tech Innovation Labs",
        "posted_by_id": "recruiter-1",
        "posted_by_name": "David Miller",
        "type": "internship",
        "description": "Join our applied intelligence lab for a 12-week paid fellowship. Work directly on edge-accelerated models, web interfaces, and high-concurrency systems.",
        "required_skills": ["Python", "FastAPI", "Docker", "React", "System Design"],
        "stipend_prize": "$1,200 / Month + Mentorship",
        "deadline": "2026-03-31",
        "location": "Bengaluru Innovation Hub / Hybrid",
        "applications_count": 14,
        "created_at": "2026-02-05"
    },
    {
        "id": "opp-3",
        "title": "Open Source Mobile App: Campus Carpooling",
        "organization": "Student Developer Society",
        "posted_by_id": "student-1",
        "posted_by_name": "Alex Chen",
        "type": "project",
        "description": "Student-led initiative to build a safe, campus-verified carpooling and ride-sharing mobile app for university commuters.",
        "required_skills": ["Kotlin", "Flutter", "Figma", "Node.js"],
        "stipend_prize": "Open Source Project Credits",
        "deadline": "2026-05-01",
        "location": "Campus / Remote",
        "applications_count": 5,
        "created_at": "2026-02-12"
    }
]

async def seed_database():
    users_col = db_manager.get_collection("users")
    existing_count = await users_col.count_documents({})
    if existing_count > 0:
        print(f"[*] Database already contains {existing_count} users. Skipping initial seed.")
        return

    print("[*] Seeding initial SkillBridge data...")

    # Seed users with hashed passwords
    hashed_pwd = hash_password("password123")
    for user in SEED_USERS:
        u_copy = dict(user)
        u_copy["password_hash"] = hashed_pwd
        u_copy["created_at"] = datetime.utcnow().isoformat()
        await users_col.insert_one(u_copy)

    # Seed certificates
    certs_col = db_manager.get_collection("certificates")
    for cert in SEED_CERTIFICATES:
        c_copy = dict(cert)
        c_copy["created_at"] = datetime.utcnow().isoformat()
        await certs_col.insert_one(c_copy)

    # Seed collaborations
    collabs_col = db_manager.get_collection("collaborations")
    for collab in SEED_COLLABORATIONS:
        await collabs_col.insert_one(dict(collab))

    # Seed opportunities
    opps_col = db_manager.get_collection("opportunities")
    for opp in SEED_OPPORTUNITIES:
        await opps_col.insert_one(dict(opp))

    print("[*] Database seeded successfully with demo users, certificates, projects, and opportunities!")
