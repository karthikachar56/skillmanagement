import sys
import os
from pathlib import Path
from datetime import datetime
import json
import asyncio

# Ensure backend path is in sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent))

from app.auth_utils import hash_password
from app.database import init_db, db_manager

hashed_pwd = hash_password("password123")

new_users = [
    {
        "id": "student-6",
        "name": "Vikram Malhotra",
        "email": "vikram.malhotra@campus.edu",
        "role": "student",
        "avatar": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop&crop=faces",
        "department": "Computer Science & Engineering",
        "semester": 6,
        "srn": "PES2UG22CS089",
        "phone": "+91 98451 12001",
        "whatsapp": "+919845112001",
        "bio": "Natural Language Processing enthusiast specializing in LLM fine-tuning and retrieval augmented generation (RAG).",
        "github_url": "https://github.com/vikram-nlp",
        "linkedin_url": "https://linkedin.com/in/vikram-malhotra",
        "portfolio_url": "https://vikram-nlp.dev",
        "available_for_collaboration": True,
        "profile_views": 98,
        "skills": [
            {"name": "Python", "category": "technical", "proficiency": "advanced", "verified": True, "endorsements": 10},
            {"name": "PyTorch", "category": "data_ai", "proficiency": "advanced", "verified": True, "endorsements": 7},
            {"name": "HuggingFace", "category": "data_ai", "proficiency": "advanced", "verified": True, "endorsements": 8},
            {"name": "LangChain", "category": "data_ai", "proficiency": "intermediate", "verified": False, "endorsements": 5}
        ],
        "projects": [
            {
                "id": "proj-v1",
                "title": "Campus Q&A RAG Bot",
                "description": "Hybrid dense-sparse retrieval system answering university administrative queries.",
                "skills_used": ["Python", "PyTorch", "LangChain"],
                "live_url": "https://campus-rag.vercel.app",
                "github_url": "https://github.com/vikram-nlp/campus-rag",
                "role": "Lead ML Engineer",
                "date": "Nov 2025"
            }
        ],
        "password_hash": hashed_pwd,
        "created_at": datetime.utcnow().isoformat()
    },
    {
        "id": "student-7",
        "name": "Ananya Deshmukh",
        "email": "ananya.deshmukh@campus.edu",
        "role": "student",
        "avatar": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&crop=faces",
        "department": "Information Science & Engineering",
        "semester": 6,
        "srn": "PES2UG22IS034",
        "phone": "+91 98451 12002",
        "whatsapp": "+919845112002",
        "bio": "Cloud DevOps fanatic building fault-tolerant Kubernetes architectures and automated CI/CD deployment pipelines.",
        "github_url": "https://github.com/ananya-cloud",
        "linkedin_url": "https://linkedin.com/in/ananya-deshmukh",
        "portfolio_url": "https://ananya.cloud",
        "available_for_collaboration": True,
        "profile_views": 114,
        "skills": [
            {"name": "Docker", "category": "technical", "proficiency": "advanced", "verified": True, "endorsements": 9},
            {"name": "Kubernetes", "category": "technical", "proficiency": "intermediate", "verified": True, "endorsements": 6},
            {"name": "AWS", "category": "technical", "proficiency": "advanced", "verified": True, "endorsements": 7},
            {"name": "Terraform", "category": "technical", "proficiency": "intermediate", "verified": False, "endorsements": 4}
        ],
        "projects": [
            {
                "id": "proj-a1",
                "title": "GitOps Microservices Cluster",
                "description": "Zero-downtime deployment platform using ArgoCD and automated canary rollouts.",
                "skills_used": ["Docker", "Kubernetes", "AWS"],
                "live_url": "https://gitops-demo.dev",
                "github_url": "https://github.com/ananya-cloud/gitops-infra",
                "role": "DevOps Architect",
                "date": "Dec 2025"
            }
        ],
        "password_hash": hashed_pwd,
        "created_at": datetime.utcnow().isoformat()
    },
    {
        "id": "student-8",
        "name": "Rohan Iyer",
        "email": "rohan.iyer@campus.edu",
        "role": "student",
        "avatar": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=faces",
        "department": "Computer Science & Engineering",
        "semester": 4,
        "srn": "PES2UG23CS112",
        "phone": "+91 98451 12003",
        "whatsapp": "+919845112003",
        "bio": "Offensive security researcher and CTF player. Passionate about reverse engineering, binary exploitation, and cryptanalysis.",
        "github_url": "https://github.com/rohan-sec",
        "linkedin_url": "https://linkedin.com/in/rohan-iyer-sec",
        "portfolio_url": "https://rohan-sec.io",
        "available_for_collaboration": True,
        "profile_views": 86,
        "skills": [
            {"name": "Cybersecurity", "category": "technical", "proficiency": "advanced", "verified": True, "endorsements": 11},
            {"name": "Linux", "category": "technical", "proficiency": "advanced", "verified": True, "endorsements": 8},
            {"name": "Python", "category": "technical", "proficiency": "intermediate", "verified": False, "endorsements": 5},
            {"name": "Wireshark", "category": "technical", "proficiency": "intermediate", "verified": True, "endorsements": 6}
        ],
        "projects": [
            {
                "id": "proj-r1",
                "title": "Campus Packet Analyzer",
                "description": "Real-time malicious traffic and ARP spoofing detector for campus Wi-Fi networks.",
                "skills_used": ["Linux", "Cybersecurity", "Python"],
                "live_url": "https://packet-guardian.live",
                "github_url": "https://github.com/rohan-sec/net-guardian",
                "role": "Security Researcher",
                "date": "Jan 2026"
            }
        ],
        "password_hash": hashed_pwd,
        "created_at": datetime.utcnow().isoformat()
    },
    {
        "id": "student-9",
        "name": "Sneha Reddy",
        "email": "sneha.reddy@campus.edu",
        "role": "student",
        "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=faces",
        "department": "Information Science & Engineering",
        "semester": 4,
        "srn": "PES2UG23IS077",
        "phone": "+91 98451 12004",
        "whatsapp": "+919845112004",
        "bio": "Frontend wizard obsessed with silky animations, WebGL, Tailwind CSS, and 100/100 Lighthouse performance scores.",
        "github_url": "https://github.com/snehareddy-fe",
        "linkedin_url": "https://linkedin.com/in/sneha-reddy-fe",
        "portfolio_url": "https://sneha-codes.art",
        "available_for_collaboration": True,
        "profile_views": 132,
        "skills": [
            {"name": "React", "category": "technical", "proficiency": "advanced", "verified": True, "endorsements": 12},
            {"name": "TypeScript", "category": "technical", "proficiency": "advanced", "verified": True, "endorsements": 9},
            {"name": "Tailwind CSS", "category": "technical", "proficiency": "advanced", "verified": True, "endorsements": 10},
            {"name": "Next.js", "category": "technical", "proficiency": "intermediate", "verified": False, "endorsements": 6}
        ],
        "projects": [
            {
                "id": "proj-sn1",
                "title": "Interactive Campus 3D Map",
                "description": "Three.js interactive campus navigation with real-time room availability status.",
                "skills_used": ["React", "TypeScript", "Tailwind CSS"],
                "live_url": "https://campus-3d.web.app",
                "github_url": "https://github.com/snehareddy-fe/campus-3d",
                "role": "Lead Frontend Engineer",
                "date": "Dec 2025"
            }
        ],
        "password_hash": hashed_pwd,
        "created_at": datetime.utcnow().isoformat()
    },
    {
        "id": "student-10",
        "name": "Kavya Nair",
        "email": "kavya.nair@campus.edu",
        "role": "student",
        "avatar": "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&h=200&fit=crop&crop=faces",
        "department": "Computer Science & Engineering",
        "semester": 6,
        "srn": "PES2UG22CS155",
        "phone": "+91 98451 12005",
        "whatsapp": "+919845112005",
        "bio": "Cross-platform mobile engineer with 4 published Flutter applications on Play Store. Clean architecture advocate.",
        "github_url": "https://github.com/kavya-mobile",
        "linkedin_url": "https://linkedin.com/in/kavya-nair-app",
        "portfolio_url": "https://kavya-apps.dev",
        "available_for_collaboration": True,
        "profile_views": 95,
        "skills": [
            {"name": "Flutter", "category": "technical", "proficiency": "advanced", "verified": True, "endorsements": 10},
            {"name": "Kotlin", "category": "technical", "proficiency": "intermediate", "verified": False, "endorsements": 5},
            {"name": "Firebase", "category": "technical", "proficiency": "advanced", "verified": True, "endorsements": 8},
            {"name": "UI/UX Design", "category": "technical", "proficiency": "intermediate", "verified": False, "endorsements": 4}
        ],
        "projects": [
            {
                "id": "proj-k1",
                "title": "PeerRide - Campus Carpool",
                "description": "Realtime student carpool and ride-sharing app with live GPS tracking.",
                "skills_used": ["Flutter", "Firebase"],
                "live_url": "https://play.google.com/store/apps/details?id=com.campus.peerride",
                "github_url": "https://github.com/kavya-mobile/peerride",
                "role": "Sole App Developer",
                "date": "Oct 2025"
            }
        ],
        "password_hash": hashed_pwd,
        "created_at": datetime.utcnow().isoformat()
    },
    {
        "id": "student-11",
        "name": "Arjun Mehta",
        "email": "arjun.mehta@campus.edu",
        "role": "student",
        "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=faces",
        "department": "Computer Science & Engineering",
        "semester": 6,
        "srn": "PES2UG22CS210",
        "phone": "+91 98451 12006",
        "whatsapp": "+919845112006",
        "bio": "Decentralized systems builder. Writing smart contracts in Solidity and Rust with zero-knowledge proof integrations.",
        "github_url": "https://github.com/arjun-web3",
        "linkedin_url": "https://linkedin.com/in/arjun-mehta-eth",
        "portfolio_url": "https://arjun-eth.xyz",
        "available_for_collaboration": True,
        "profile_views": 78,
        "skills": [
            {"name": "Solidity", "category": "technical", "proficiency": "advanced", "verified": True, "endorsements": 7},
            {"name": "Rust", "category": "technical", "proficiency": "intermediate", "verified": True, "endorsements": 6},
            {"name": "Ethereum", "category": "technical", "proficiency": "advanced", "verified": True, "endorsements": 8},
            {"name": "React", "category": "technical", "proficiency": "intermediate", "verified": False, "endorsements": 4}
        ],
        "projects": [
            {
                "id": "proj-am1",
                "title": "VeriCert - On-Chain Academic Credentials",
                "description": "Soulbound NFT credentials verifying student exam marks and certificates on Polygon.",
                "skills_used": ["Solidity", "Ethereum", "React"],
                "live_url": "https://vericert.eth.limo",
                "github_url": "https://github.com/arjun-web3/vericert",
                "role": "Smart Contract Engineer",
                "date": "Jan 2026"
            }
        ],
        "password_hash": hashed_pwd,
        "created_at": datetime.utcnow().isoformat()
    },
    {
        "id": "student-12",
        "name": "Ishaan Joshi",
        "email": "ishaan.joshi@campus.edu",
        "role": "student",
        "avatar": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&h=200&fit=crop&crop=faces",
        "department": "Artificial Intelligence & Data Science",
        "semester": 4,
        "srn": "PES2UG23AI018",
        "phone": "+91 98451 12007",
        "whatsapp": "+919845112007",
        "bio": "Computer Vision researcher building real-time edge video analytics with YOLOv11 and TensorRT.",
        "github_url": "https://github.com/ishaan-cv",
        "linkedin_url": "https://linkedin.com/in/ishaan-joshi-cv",
        "portfolio_url": "https://ishaan-vision.ai",
        "available_for_collaboration": True,
        "profile_views": 102,
        "skills": [
            {"name": "Computer Vision", "category": "data_ai", "proficiency": "advanced", "verified": True, "endorsements": 9},
            {"name": "Python", "category": "technical", "proficiency": "advanced", "verified": True, "endorsements": 10},
            {"name": "PyTorch", "category": "data_ai", "proficiency": "intermediate", "verified": True, "endorsements": 7},
            {"name": "Docker", "category": "technical", "proficiency": "intermediate", "verified": False, "endorsements": 4}
        ],
        "projects": [
            {
                "id": "proj-ij1",
                "title": "Smart Campus Parking Vision",
                "description": "Real-time CCTV occupancy detector using YOLO and OpenCV running on Raspberry Pi 5.",
                "skills_used": ["Computer Vision", "Python", "PyTorch"],
                "live_url": "https://campus-parking.ai",
                "github_url": "https://github.com/ishaan-cv/smart-parking",
                "role": "Lead CV Researcher",
                "date": "Nov 2025"
            }
        ],
        "password_hash": hashed_pwd,
        "created_at": datetime.utcnow().isoformat()
    },
    {
        "id": "student-13",
        "name": "Meera Krishnan",
        "email": "meera.krishnan@campus.edu",
        "role": "student",
        "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces",
        "department": "Information Science & Engineering",
        "semester": 6,
        "srn": "PES2UG22IS091",
        "phone": "+91 98451 12008",
        "whatsapp": "+919845112008",
        "bio": "Product designer translating intricate algorithmic platforms into intuitive, delightful student experiences.",
        "github_url": "https://github.com/meera-design",
        "linkedin_url": "https://linkedin.com/in/meera-krishnan-ui",
        "portfolio_url": "https://meera.design",
        "available_for_collaboration": True,
        "profile_views": 148,
        "skills": [
            {"name": "Figma", "category": "design", "proficiency": "advanced", "verified": True, "endorsements": 14},
            {"name": "UI/UX Design", "category": "design", "proficiency": "advanced", "verified": True, "endorsements": 12},
            {"name": "Tailwind CSS", "category": "technical", "proficiency": "intermediate", "verified": True, "endorsements": 6},
            {"name": "Leadership", "category": "non_technical", "proficiency": "advanced", "verified": True, "endorsements": 8}
        ],
        "projects": [
            {
                "id": "proj-mk1",
                "title": "Luminary - Campus Design System",
                "description": "Component library and accessibility token system with 80+ modular Figma components.",
                "skills_used": ["Figma", "UI/UX Design", "Tailwind CSS"],
                "live_url": "https://figma.com/@meera_luminary",
                "github_url": "https://github.com/meera-design/luminary-ui",
                "role": "Product Lead",
                "date": "Sep 2025"
            }
        ],
        "password_hash": hashed_pwd,
        "created_at": datetime.utcnow().isoformat()
    },
    {
        "id": "student-14",
        "name": "Tanvi Saxena",
        "email": "tanvi.saxena@campus.edu",
        "role": "student",
        "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=faces",
        "department": "Artificial Intelligence & Data Science",
        "semester": 4,
        "srn": "PES2UG23AI049",
        "phone": "+91 98451 12009",
        "whatsapp": "+919845112009",
        "bio": "Big data architect. Loves orchestrating distributed streaming pipelines with Kafka, Spark, and dbt.",
        "github_url": "https://github.com/tanvi-data",
        "linkedin_url": "https://linkedin.com/in/tanvi-saxena-data",
        "portfolio_url": "https://tanvi-data.io",
        "available_for_collaboration": True,
        "profile_views": 82,
        "skills": [
            {"name": "SQL", "category": "technical", "proficiency": "advanced", "verified": True, "endorsements": 11},
            {"name": "Python", "category": "technical", "proficiency": "advanced", "verified": True, "endorsements": 9},
            {"name": "Kafka", "category": "technical", "proficiency": "intermediate", "verified": True, "endorsements": 5},
            {"name": "Docker", "category": "technical", "proficiency": "intermediate", "verified": False, "endorsements": 4}
        ],
        "projects": [
            {
                "id": "proj-ts1",
                "title": "StreamPulse Analytics Engine",
                "description": "Real-time telemetry ingestion pipeline processing 10,000 events/sec with Apache Kafka and ClickHouse.",
                "skills_used": ["SQL", "Python", "Kafka", "Docker"],
                "live_url": "https://streampulse.io/demo",
                "github_url": "https://github.com/tanvi-data/streampulse",
                "role": "Data Pipeline Architect",
                "date": "Jan 2026"
            }
        ],
        "password_hash": hashed_pwd,
        "created_at": datetime.utcnow().isoformat()
    },
    {
        "id": "student-15",
        "name": "Aditya Kulkarni",
        "email": "aditya.kulkarni@campus.edu",
        "role": "student",
        "avatar": "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&h=200&fit=crop&crop=faces",
        "department": "Computer Science & Engineering",
        "semester": 4,
        "srn": "PES2UG23CS004",
        "phone": "+91 98451 12010",
        "whatsapp": "+919845112010",
        "bio": "Full-stack builder passionate about Node.js microservices, PostgreSQL query tuning, and resilient web architectures.",
        "github_url": "https://github.com/aditya-kulkarni",
        "linkedin_url": "https://linkedin.com/in/aditya-kulkarni-dev",
        "portfolio_url": "https://adityadev.me",
        "available_for_collaboration": True,
        "profile_views": 105,
        "skills": [
            {"name": "React", "category": "technical", "proficiency": "advanced", "verified": True, "endorsements": 9},
            {"name": "FastAPI", "category": "technical", "proficiency": "intermediate", "verified": True, "endorsements": 6},
            {"name": "SQL", "category": "technical", "proficiency": "advanced", "verified": True, "endorsements": 8},
            {"name": "Docker", "category": "technical", "proficiency": "intermediate", "verified": False, "endorsements": 4}
        ],
        "projects": [
            {
                "id": "proj-ak1",
                "title": "Campus Hackathon Portal",
                "description": "Full-lifecycle team registration and scoring engine for college competitions.",
                "skills_used": ["React", "FastAPI", "SQL"],
                "live_url": "https://campushack.club",
                "github_url": "https://github.com/aditya-kulkarni/campushack",
                "role": "Backend Lead",
                "date": "Oct 2025"
            }
        ],
        "password_hash": hashed_pwd,
        "created_at": datetime.utcnow().isoformat()
    },
    {
        "id": "student-16",
        "name": "Pooja Hegde",
        "email": "pooja.hegde@campus.edu",
        "role": "student",
        "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces",
        "department": "Electronics & Communication Engineering",
        "semester": 6,
        "srn": "PES2UG22EC061",
        "phone": "+91 98451 12011",
        "whatsapp": "+919845112011",
        "bio": "Hardware and firmware hacker. Building low-power ESP32 sensor networks and solar battery charge telemetry controllers.",
        "github_url": "https://github.com/pooja-embed",
        "linkedin_url": "https://linkedin.com/in/pooja-hegde-iot",
        "portfolio_url": "https://pooja-iot.tech",
        "available_for_collaboration": True,
        "profile_views": 89,
        "skills": [
            {"name": "C++", "category": "technical", "proficiency": "advanced", "verified": True, "endorsements": 10},
            {"name": "IoT", "category": "technical", "proficiency": "advanced", "verified": True, "endorsements": 11},
            {"name": "Embedded Systems", "category": "technical", "proficiency": "advanced", "verified": True, "endorsements": 8},
            {"name": "Arduino", "category": "technical", "proficiency": "intermediate", "verified": False, "endorsements": 6}
        ],
        "projects": [
            {
                "id": "proj-ph1",
                "title": "SolarGrid Telemetry Node",
                "description": "Solar irradiance tracking with LoRaWAN wireless transmission to university server.",
                "skills_used": ["C++", "IoT", "Embedded Systems"],
                "live_url": "https://solargrid-demo.org",
                "github_url": "https://github.com/pooja-embed/solargrid",
                "role": "Embedded Architect",
                "date": "Nov 2025"
            }
        ],
        "password_hash": hashed_pwd,
        "created_at": datetime.utcnow().isoformat()
    },
    {
        "id": "student-17",
        "name": "Nikhil Rao",
        "email": "nikhil.rao@campus.edu",
        "role": "student",
        "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces",
        "department": "Mechanical Engineering",
        "semester": 6,
        "srn": "PES2UG22ME044",
        "phone": "+91 98451 12012",
        "whatsapp": "+919845112012",
        "bio": "Robotics engineer specializing in autonomous path planning, SLAM navigation, and ROS2 mobile robot platforms.",
        "github_url": "https://github.com/nikhil-robotics",
        "linkedin_url": "https://linkedin.com/in/nikhil-rao-robotics",
        "portfolio_url": "https://nikhil-robotics.space",
        "available_for_collaboration": True,
        "profile_views": 93,
        "skills": [
            {"name": "C++", "category": "technical", "proficiency": "advanced", "verified": True, "endorsements": 9},
            {"name": "Python", "category": "technical", "proficiency": "advanced", "verified": True, "endorsements": 8},
            {"name": "System Design", "category": "technical", "proficiency": "intermediate", "verified": False, "endorsements": 4},
            {"name": "Leadership", "category": "non_technical", "proficiency": "intermediate", "verified": True, "endorsements": 5}
        ],
        "projects": [
            {
                "id": "proj-nr1",
                "title": "Autonomous Rover Nav2",
                "description": "LiDAR-equipped 4WD mobile robot navigating university corridors autonomously.",
                "skills_used": ["C++", "Python", "System Design"],
                "live_url": "https://rover-nav.tech",
                "github_url": "https://github.com/nikhil-robotics/rover-nav",
                "role": "Robotics Lead",
                "date": "Dec 2025"
            }
        ],
        "password_hash": hashed_pwd,
        "created_at": datetime.utcnow().isoformat()
    },
    {
        "id": "student-18",
        "name": "Divya Sharma",
        "email": "divya.sharma@campus.edu",
        "role": "student",
        "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=faces",
        "department": "Artificial Intelligence & Data Science",
        "semester": 6,
        "srn": "PES2UG22AI080",
        "phone": "+91 98451 12013",
        "whatsapp": "+919845112013",
        "bio": "Generative AI researcher building multimodal agent workflows and structured tool calling with Gemini & Claude.",
        "github_url": "https://github.com/divya-genai",
        "linkedin_url": "https://linkedin.com/in/divya-sharma-ai",
        "portfolio_url": "https://divya-ai.com",
        "available_for_collaboration": True,
        "profile_views": 128,
        "skills": [
            {"name": "Python", "category": "technical", "proficiency": "advanced", "verified": True, "endorsements": 13},
            {"name": "FastAPI", "category": "technical", "proficiency": "advanced", "verified": True, "endorsements": 10},
            {"name": "PyTorch", "category": "data_ai", "proficiency": "advanced", "verified": True, "endorsements": 9},
            {"name": "Docker", "category": "technical", "proficiency": "intermediate", "verified": True, "endorsements": 6}
        ],
        "projects": [
            {
                "id": "proj-ds1",
                "title": "Agentic Research Summarizer",
                "description": "Multi-agent system synthesizing arXiv AI research papers into actionable audio summaries.",
                "skills_used": ["Python", "FastAPI", "PyTorch"],
                "live_url": "https://arxiv-agents.ai",
                "github_url": "https://github.com/divya-genai/arxiv-agents",
                "role": "Lead AI Engineer",
                "date": "Jan 2026"
            }
        ],
        "password_hash": hashed_pwd,
        "created_at": datetime.utcnow().isoformat()
    },
    {
        "id": "student-19",
        "name": "Siddharth Roy",
        "email": "siddharth.roy@campus.edu",
        "role": "student",
        "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=faces",
        "department": "Computer Science & Engineering",
        "semester": 4,
        "srn": "PES2UG23CS189",
        "phone": "+91 98451 12014",
        "whatsapp": "+919845112014",
        "bio": "Indie game developer & 3D graphics engineer. Building physics-based VR interactions in Unity and Godot.",
        "github_url": "https://github.com/siddharth-games",
        "linkedin_url": "https://linkedin.com/in/siddharth-roy-game",
        "portfolio_url": "https://siddharth-games.itch.io",
        "available_for_collaboration": True,
        "profile_views": 84,
        "skills": [
            {"name": "C++", "category": "technical", "proficiency": "advanced", "verified": True, "endorsements": 8},
            {"name": "UI/UX Design", "category": "design", "proficiency": "intermediate", "verified": False, "endorsements": 5},
            {"name": "Python", "category": "technical", "proficiency": "intermediate", "verified": False, "endorsements": 4}
        ],
        "projects": [
            {
                "id": "proj-sr1",
                "title": "Chronos Rift - Physics Platformer",
                "description": "Time manipulation mechanic in custom C++ OpenGL rendering engine.",
                "skills_used": ["C++", "Python"],
                "live_url": "https://siddharth.itch.io/chronos-rift",
                "github_url": "https://github.com/siddharth-games/chronos",
                "role": "Game Director",
                "date": "Oct 2025"
            }
        ],
        "password_hash": hashed_pwd,
        "created_at": datetime.utcnow().isoformat()
    },
    {
        "id": "student-20",
        "name": "Rhea Sen",
        "email": "rhea.sen@campus.edu",
        "role": "student",
        "avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=faces",
        "department": "Information Science & Engineering",
        "semester": 6,
        "srn": "PES2UG22IS109",
        "phone": "+91 98451 12015",
        "whatsapp": "+919845112015",
        "bio": "FinTech software engineer exploring algorithmic trading backtesting engines and ultra-low latency WebSocket APIs.",
        "github_url": "https://github.com/rhea-fintech",
        "linkedin_url": "https://linkedin.com/in/rhea-sen-fintech",
        "portfolio_url": "https://rhea-quant.dev",
        "available_for_collaboration": True,
        "profile_views": 118,
        "skills": [
            {"name": "Python", "category": "technical", "proficiency": "advanced", "verified": True, "endorsements": 11},
            {"name": "SQL", "category": "technical", "proficiency": "advanced", "verified": True, "endorsements": 9},
            {"name": "FastAPI", "category": "technical", "proficiency": "intermediate", "verified": True, "endorsements": 7},
            {"name": "Docker", "category": "technical", "proficiency": "intermediate", "verified": False, "endorsements": 5}
        ],
        "projects": [
            {
                "id": "proj-rs1",
                "title": "TradePulse - High-Frequency Backtester",
                "description": "Event-driven options backtesting framework simulating slippage and order book depth.",
                "skills_used": ["Python", "SQL", "FastAPI"],
                "live_url": "https://tradepulse-quant.io",
                "github_url": "https://github.com/rhea-fintech/tradepulse",
                "role": "Quant Developer",
                "date": "Dec 2025"
            }
        ],
        "password_hash": hashed_pwd,
        "created_at": datetime.utcnow().isoformat()
    },
    {
        "id": "student-21",
        "name": "Varun Agarwal",
        "email": "varun.agarwal@campus.edu",
        "role": "student",
        "avatar": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=faces",
        "department": "Electronics & Communication Engineering",
        "semester": 4,
        "srn": "PES2UG23EC015",
        "phone": "+91 98451 12016",
        "whatsapp": "+919845112016",
        "bio": "RF & antenna engineer testing high-bandwidth 5G mmWave phased array beamforming algorithms.",
        "github_url": "https://github.com/varun-rf",
        "linkedin_url": "https://linkedin.com/in/varun-agarwal-rf",
        "portfolio_url": "https://varun-rf.space",
        "available_for_collaboration": True,
        "profile_views": 67,
        "skills": [
            {"name": "C++", "category": "technical", "proficiency": "intermediate", "verified": True, "endorsements": 7},
            {"name": "IoT", "category": "technical", "proficiency": "advanced", "verified": True, "endorsements": 8},
            {"name": "Embedded Systems", "category": "technical", "proficiency": "intermediate", "verified": False, "endorsements": 5}
        ],
        "projects": [
            {
                "id": "proj-va1",
                "title": "PhasedArray BeamSteerer",
                "description": "FPGA-controlled phase shifters for directional 2.4 GHz signal reception.",
                "skills_used": ["C++", "IoT", "Embedded Systems"],
                "live_url": "https://rf-beamsteer.org",
                "github_url": "https://github.com/varun-rf/beamsteer",
                "role": "Hardware RF Engineer",
                "date": "Nov 2025"
            }
        ],
        "password_hash": hashed_pwd,
        "created_at": datetime.utcnow().isoformat()
    },
    {
        "id": "student-22",
        "name": "Neha Pillai",
        "email": "neha.pillai@campus.edu",
        "role": "student",
        "avatar": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&crop=faces",
        "department": "Biotechnology",
        "semester": 6,
        "srn": "PES2UG22BT019",
        "phone": "+91 98451 12017",
        "whatsapp": "+919845112017",
        "bio": "Computational biologist developing deep learning models for protein 3D structure folding and ligand binding affinity.",
        "github_url": "https://github.com/neha-biopy",
        "linkedin_url": "https://linkedin.com/in/neha-pillai-bio",
        "portfolio_url": "https://neha-fold.bio",
        "available_for_collaboration": True,
        "profile_views": 88,
        "skills": [
            {"name": "Python", "category": "technical", "proficiency": "advanced", "verified": True, "endorsements": 10},
            {"name": "PyTorch", "category": "data_ai", "proficiency": "intermediate", "verified": True, "endorsements": 7},
            {"name": "Data Analysis", "category": "data_ai", "proficiency": "advanced", "verified": True, "endorsements": 8}
        ],
        "projects": [
            {
                "id": "proj-np1",
                "title": "FoldAffinity - Drug Discovery AI",
                "description": "Graph neural network predicting molecular binding affinity with targeted enzymes.",
                "skills_used": ["Python", "PyTorch"],
                "live_url": "https://foldaffinity.bio.app",
                "github_url": "https://github.com/neha-biopy/foldaffinity",
                "role": "Lead Bio-ML Engineer",
                "date": "Jan 2026"
            }
        ],
        "password_hash": hashed_pwd,
        "created_at": datetime.utcnow().isoformat()
    },
    {
        "id": "student-23",
        "name": "Pranav Bhat",
        "email": "pranav.bhat@campus.edu",
        "role": "student",
        "avatar": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop&crop=faces",
        "department": "Computer Science & Engineering",
        "semester": 6,
        "srn": "PES2UG22CS278",
        "phone": "+91 98451 12018",
        "whatsapp": "+919845112018",
        "bio": "Low-level systems hacker writing Linux eBPF kernel tracing utilities and memory-safe async runtimes in Rust.",
        "github_url": "https://github.com/pranav-systems",
        "linkedin_url": "https://linkedin.com/in/pranav-bhat-systems",
        "portfolio_url": "https://pranav-kernel.space",
        "available_for_collaboration": True,
        "profile_views": 122,
        "skills": [
            {"name": "Rust", "category": "technical", "proficiency": "advanced", "verified": True, "endorsements": 11},
            {"name": "C++", "category": "technical", "proficiency": "advanced", "verified": True, "endorsements": 10},
            {"name": "Linux", "category": "technical", "proficiency": "advanced", "verified": True, "endorsements": 12},
            {"name": "System Design", "category": "technical", "proficiency": "advanced", "verified": True, "endorsements": 8}
        ],
        "projects": [
            {
                "id": "proj-pb1",
                "title": "eBPF-Shield - Kernel Threat Monitor",
                "description": "Zero-overhead privilege escalation detection running directly in the Linux kernel.",
                "skills_used": ["Rust", "C++", "Linux", "System Design"],
                "live_url": "https://ebpf-shield.io",
                "github_url": "https://github.com/pranav-systems/ebpf-shield",
                "role": "Systems Architect",
                "date": "Dec 2025"
            }
        ],
        "password_hash": hashed_pwd,
        "created_at": datetime.utcnow().isoformat()
    },
    {
        "id": "faculty-3",
        "name": "Dr. Vikramaditya Sen",
        "email": "dr.vsen@campus.edu",
        "role": "faculty",
        "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces",
        "department": "Computer Science & Engineering",
        "title": "Associate Dean of Research & AI Lab Director",
        "phone": "+91 98451 12019",
        "whatsapp": "+919845112019",
        "bio": "Guiding university research in scalable distributed consensus protocols and neural architecture search.",
        "github_url": "https://github.com/dr-vsen",
        "linkedin_url": "https://linkedin.com/in/dr-vikramaditya-sen",
        "portfolio_url": "https://campus.edu/faculty/vsen",
        "available_for_collaboration": False,
        "profile_views": 230,
        "skills": [
            {"name": "System Design", "category": "technical", "proficiency": "advanced", "verified": True, "endorsements": 20},
            {"name": "Python", "category": "technical", "proficiency": "advanced", "verified": True, "endorsements": 18},
            {"name": "Leadership", "category": "non_technical", "proficiency": "advanced", "verified": True, "endorsements": 22}
        ],
        "projects": [],
        "password_hash": hashed_pwd,
        "created_at": datetime.utcnow().isoformat()
    },
    {
        "id": "recruiter-2",
        "name": "Samantha Wright",
        "email": "samantha.wright@deepmind.com",
        "role": "recruiter",
        "avatar": "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&h=200&fit=crop&crop=faces",
        "organization": "Google DeepMind Campus Relations",
        "title": "Lead University Talent Partner",
        "phone": "+91 98451 12020",
        "whatsapp": "+919845112020",
        "bio": "Scouting outstanding campus engineers, research interns, and open-source contributors for frontier AI research teams.",
        "github_url": "https://github.com/google-deepmind",
        "linkedin_url": "https://linkedin.com/in/samantha-wright-recruiter",
        "portfolio_url": "https://deepmind.google/careers",
        "available_for_collaboration": False,
        "profile_views": 315,
        "skills": [
            {"name": "Leadership", "category": "non_technical", "proficiency": "advanced", "verified": True, "endorsements": 25},
            {"name": "Communication", "category": "non_technical", "proficiency": "advanced", "verified": True, "endorsements": 24}
        ],
        "projects": [],
        "password_hash": hashed_pwd,
        "created_at": datetime.utcnow().isoformat()
    }
]

async def main():
    await init_db()
    users_col = db_manager.get_collection("users")
    
    inserted = 0
    for u in new_users:
        doc = dict(u)
        doc["_id"] = doc["id"]
        op = chr(36) + "set"
        await users_col.update_one({"id": doc["id"]}, {op: doc}, upsert=True)
        inserted += 1
    print(f"[*] Successfully upserted {inserted} users into MongoDB Atlas!")

    # Also sync into data/users.json
    json_path = os.path.join(os.path.dirname(__file__), "data", "users.json")
    with open(json_path, "r", encoding="utf-8") as f:
        existing = json.load(f)
    existing_map = {x.get("id"): x for x in existing}
    for u in new_users:
        existing_map[u["id"]] = u
    updated_list = list(existing_map.values())
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(updated_list, f, indent=2)
    print(f"[*] Updated local data/users.json with total {len(updated_list)} users.")

if __name__ == "__main__":
    asyncio.run(main())
