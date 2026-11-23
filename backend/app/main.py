import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import init_db, get_db_status
from app.seed import seed_database
from app.routes import (
    auth,
    students,
    certificates,
    search,
    collaborations,
    opportunities,
    ai,
    analytics,
    admin
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("[*] Starting SkillBridge Backend Service...")
    await init_db()
    await seed_database()
    yield
    # Shutdown
    print("[*] SkillBridge Backend Service shutting down.")

app = FastAPI(
    title="SkillBridge - Student Talent & Skill Management API",
    description="Campus-wide student skill discovery, portfolio verification, peer collaboration and AI recruitment engine.",
    version="2.4.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API Routers
app.include_router(auth.router)
app.include_router(students.router)
app.include_router(certificates.router)
app.include_router(search.router)
app.include_router(collaborations.router)
app.include_router(opportunities.router)
app.include_router(ai.router)
app.include_router(analytics.router)
app.include_router(admin.router)

@app.get("/api")
@app.get("/")
async def root():
    return {
        "platform": "SkillBridge - Student Skill Management System (SSMS)",
        "tagline": "Discover Talent. Connect Skills. Build Together.",
        "version": "2.4.0",
        "database": get_db_status(),
        "docs": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
