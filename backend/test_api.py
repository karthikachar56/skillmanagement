import asyncio
from fastapi.testclient import TestClient
from app.main import app

def run_tests():
    with TestClient(app) as client:
        print("1. Testing Root endpoint...")
        res = client.get("/")
        assert res.status_code == 200, f"Root failed: {res.text}"
        data = res.json()
        print(f"   ✓ Root OK: {data['platform']} (DB: {data['database']['engine']})")

        print("2. Testing Demo Users...")
        res = client.get("/api/auth/demo-users")
        assert res.status_code == 200, f"Demo users failed: {res.text}"
        demo_users = res.json()
        assert len(demo_users) >= 4, f"Expected at least 4 demo users, got {len(demo_users)}"
        print(f"   ✓ Demo Users OK: {len(demo_users)} roles loaded ({[u['role'] for u in demo_users]})")

        print("3. Testing Demo Login (Student)...")
        student_user = next(u for u in demo_users if u['role'] == 'student')
        res = client.post(f"/api/auth/demo-login/{student_user['id']}")
        assert res.status_code == 200, f"Login failed: {res.text}"
        token = res.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        print(f"   ✓ Login OK: Token generated for {student_user['name']}")

        print("4. Testing Talent Discovery List...")
        res = client.get("/api/students")
        assert res.status_code == 200
        students = res.json()
        print(f"   ✓ Talent List OK: Found {len(students)} students with calculated credibility scores")

        print("5. Testing Skill Search with Filters (Python)...")
        res = client.get("/api/search/talents?skills=Python&proficiency=intermediate")
        assert res.status_code == 200
        matches = res.json()
        print(f"   ✓ Skill Search OK: {len(matches)} matched students for 'Python (intermediate+)'")

        print("6. Testing Faculty Verification Queue...")
        res = client.get("/api/certificates/queue", headers=headers)
        assert res.status_code == 200
        certs = res.json()
        print(f"   ✓ Verification Queue OK: {len(certs)} total certificates in registry")

        print("7. Testing AI Squad Builder...")
        res = client.post("/api/ai/team-builder", json={
            "project_title": "Autonomous Drone Challenge",
            "description": "Looking for AI Lead, UI Designer, and Full Stack Dev"
        })
        assert res.status_code == 200
        squad = res.json()
        print(f"   ✓ AI Squad Builder OK: Recommended {squad['team_size']} members with synergy {squad['overall_synergy_score']}%")

        print("8. Testing Skill Gap Analyzer...")
        res = client.post("/api/ai/skill-gap", json={
            "student_id": student_user["id"],
            "target_role": "Full-Stack AI Engineer"
        })
        assert res.status_code == 200
        gap = res.json()
        print(f"   ✓ Skill Gap Analyzer OK: Match {gap['match_percentage']}%, {len(gap['missing_skills'])} missing skills identified")

        print("9. Testing Campus Analytics Overview...")
        res = client.get("/api/analytics/overview")
        assert res.status_code == 200
        stats = res.json()
        print(f"   ✓ Analytics OK: Top skill '{stats['top_trending_skills'][0]['name']}' with {stats['top_trending_skills'][0]['count']} proficient talents")

        print("\nAll 9 core API tests PASSED flawlessly!")

if __name__ == "__main__":
    run_tests()
