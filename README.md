# SkillBridge — Student Skill Management & Talent Discovery System (SSMS)

> **Discover Talent. Connect Skills. Build Together.**  
> A college-wide student skill discovery, portfolio verification, peer collaboration, and AI recruitment platform.

---

## 🌟 What is SkillBridge?

Every student possesses distinct abilities, but campuses struggle with fragmented talent visibility. A developer building an Android app lacks a Kotlin partner; a machine learning researcher lacks a frontend designer; recruiters lack verified skill proof; faculty lack an audit trail to endorse student achievements.

**SkillBridge** solves this by uniting talent discovery, verified credential vaults, hackathon team matching, and an AI squad builder into one centralized university ecosystem.

---

## 👥 The 4 User Roles

| Role | Core Capabilities |
| :--- | :--- |
| **1. Student** | • Build comprehensive skill profile (technical, non-technical, design, core)<br>• Upload certificates & project proofs<br>• Toggle collaboration availability ("Available for Teams")<br>• Search campus talents with multi-criteria filtering<br>• Send/receive collaboration requests & in-platform messaging<br>• Run AI Team Builder & Skill Gap Analyzer |
| **2. Faculty / Mentor** | • Faculty Verification Queue: audit student certificates with Approve/Reject actions<br>• Provide official reviewer feedback notes<br>• Endorse student technical skills with official faculty verification badges<br>• Guide student research & project teams |
| **3. Recruiter / Org** | • Search students using deep skill filters, min credibility score & department<br>• Post campus opportunities (Hackathons, Internships, Competitions, Projects)<br>• Review applications & portfolio links from students |
| **4. Administrator** | • Global platform oversight & user role management<br>• University-wide skill analytics & growth insights<br>• Certificate audit logs & system health monitor |

---

## 🚀 Key Features

### 1. 🔍 Skill Discovery Engine
- Search by keyword across name, bio, projects, and skills.
- Multi-skill filtering (e.g., `Python` + `React` + `Intermediate`).
- Filter by department, semester, and collaboration availability.
- Sliders for minimum **Skill Credibility Score**.
- **Direct WhatsApp Chat Tag:** 1-click green WhatsApp button on talent cards that opens direct WhatsApp chat (`wa.me`) with pre-filled collaboration greeting.

### 2. 📱 Sliding Dashboard Drawer
- A sliding side navigation drawer accessible via the top hamburger button.
- Choose between all 8 platform views with descriptions and AI badges.
- Features user profile summary, direct WhatsApp student helpdesk, quick persona switcher, and sign-out controls.

### 3. 🔐 Sign In & Sign Up Authentication
- Modal-based or dedicated authentication flow for all 4 roles (Student, Faculty, Recruiter, Admin).
- Capture student SRN, semester, department, and WhatsApp/phone contact number.
- Quick 1-click Demo Accounts for instant switching during live presentations.

### 4. 👤 Interactive Profile & Contact Management
- Full portfolio showcase: Skills with proficiency levels, project proof links, and verified certificates.
- Direct **WhatsApp Contact Tag & Channel** on profiles.
- Edit bio, contact info, and WhatsApp number in profile settings.

### 5. 📜 Certificate Vault & Verification Queue
- Students submit certificates with title, issuer, issue date, credential URL, and skills covered.
- Certificates enter the **Pending Review** queue.
- Faculty members audit submissions and mark them as **Verified** (with badges) or **Rejected** (with remarks).
- Upon verification, all skills covered by the certificate are automatically marked as **Verified** on the student's profile.

### 3. 🤖 AI Squad Builder & Team Matcher
- Enter a hackathon or project requirement (e.g., *"Need AI Lead, Frontend Dev, UI/UX Designer"*).
- The algorithm scores candidate affinity, complementary strengths, verified credentials, and availability to output an optimal, balanced team with synergy score!

### 4. 🎯 Skill Gap Analyzer
- Students select target benchmark career paths (e.g., *Full-Stack AI Engineer*, *Data Scientist*, *Mobile & UI Designer*, *Cloud DevOps*).
- Visualizes **Readiness Score (%)**, **Acquired Skills**, **Missing Gaps**, and recommends specific certifications & action steps.

### 5. 🤝 Student-to-Student Collaborations & Live Messaging
- Send collaboration requests specifying the project title and role needed.
- Recipient accepts or declines.
- Accepted collaborations unlock a dedicated in-platform team chat channel.

### 6. 💼 Opportunities & Hackathons Board
- Hackathon listings with prize pools, internship openings with stipends, and student-led initiatives.
- 1-click application with motivational pitch and portfolio links.

### 7. 📊 University-Wide Skill Analytics
- Top trending skills across the student body.
- Departmental talent distributions.
- Credibility leaderboard and active team metrics.

---

## 🛠️ Technology Stack

- **Backend**: Python 3.12 + FastAPI + Pydantic v2 + JWT Authentication + Passlib (Bcrypt)
- **Database Layer**: Dual-mode storage:
  - **MongoDB** via `motor.motor_asyncio` (Local `mongodb://localhost:27017` or MongoDB Atlas URI)
  - **Auto Persistent Document Store**: Automatic seamless fallback to local JSON document store in `backend/data` if MongoDB is not running, ensuring 100% immediate out-of-the-box functionality with zero installation friction!
- **Frontend**: React 19 + Vite 8 + Tailwind CSS v4 + Lucide React Icons
- **AI Matching**: Heuristic multi-factor talent affinity and synergy optimizer

---

## 🏁 Quick Start Guide

### 1. Start Both Backend & Frontend (One Command)

On Windows, double-click or run:
```powershell
.\run_dev.ps1
```
Or with batch file:
```cmd
run_dev.bat
```

### 2. Manual Startup

#### Terminal 1 — Backend:
```bash
cd backend
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
- API Base URL: `http://127.0.0.1:8000`
- Interactive Swagger UI: `http://127.0.0.1:8000/docs`

#### Terminal 2 — Frontend:
```bash
cd frontend
npm.cmd run dev
```
- Web Application: `http://localhost:5173`

---

## 🎭 Pre-Configured Demo Accounts

SkillBridge features a top banner that lets you switch personas with **1 click** to test all perspectives:

1. **Alex Chen (Student)**: `alex.chen@campus.edu` / `password123` (Full-Stack AI, CSE)
2. **Priya Patel (Student)**: `priya.patel@campus.edu` / `password123` (UI/UX & Mobile, ISE)
3. **Marcus Johnson (Student)**: `marcus.johnson@campus.edu` / `password123` (Data Science, AI/DS)
4. **Dr. Ramesh Sharma (Faculty)**: `dr.sharma@campus.edu` / `password123` (HOD Computer Science)
5. **David Miller (Recruiter)**: `recruiter@techcorp.io` / `password123` (Nexus Tech)
6. **Campus Admin**: `admin@skillbridge.edu` / `password123` (University Directorate)

---

## 📁 Repository Structure

```
skms/
├── backend/
│   ├── app/
│   │   ├── config.py             # Environment configurations
│   │   ├── database.py           # MongoDB + Document DB dual engine
│   │   ├── models.py             # Pydantic schemas
│   │   ├── auth_utils.py         # JWT tokens & Bcrypt hashing
│   │   ├── seed.py               # Pre-populated campus seed data
│   │   ├── routes/
│   │   │   ├── auth.py           # Login, register, demo switch
│   │   │   ├── students.py       # Profiles, skills, projects, endorsements
│   │   │   ├── certificates.py   # Upload & faculty verification queue
│   │   │   ├── search.py         # Multi-criteria skill discovery
│   │   │   ├── collaborations.py # P2P invites & live messaging
│   │   │   ├── opportunities.py  # Hackathons, internships, applicants
│   │   │   ├── ai.py             # AI Squad Builder & Skill Gap Analyzer
│   │   │   ├── analytics.py      # Campus-wide skill statistics
│   │   │   └── admin.py          # User management & platform settings
│   │   └── main.py               # FastAPI application entrypoint
│   ├── data/                     # Persistent local document store (when Mongo offline)
│   ├── requirements.txt          # Python dependencies
│   └── test_api.py               # Complete 9-point verification suite
│
├── frontend/
│   ├── src/
│   │   ├── components/           # Navbar, Modals, Brand Icons
│   │   ├── context/              # AuthContext (sessions & role switcher)
│   │   ├── views/                # Discovery, Profile, Vault, Collabs, AI, Analytics
│   │   ├── api.js                # Centralized REST client
│   │   ├── App.jsx               # Main application layout
│   │   └── index.css             # Tailwind CSS v4 styling
│   ├── package.json
│   └── vite.config.js            # Vite + Tailwind + Proxy setup
│
├── run_dev.bat                   # 1-click Windows Batch launcher
├── run_dev.ps1                   # 1-click PowerShell launcher
└── README.md                     # Full documentation
```
