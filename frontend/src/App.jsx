import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import TalentDiscovery from './views/TalentDiscovery';
import StudentProfile from './views/StudentProfile';
import CertificateVault from './views/CertificateVault';
import OpportunitiesBoard from './views/OpportunitiesBoard';
import CollaborationsHub from './views/CollaborationsHub';
import CampusAnalytics from './views/CampusAnalytics';
import AdminPanel from './views/AdminPanel';

import StudentModal from './components/StudentModal';
import CollabModal from './components/CollabModal';
import UploadCertModal from './components/UploadCertModal';
import SlidingDashboard from './components/SlidingDashboard';
import AuthModal from './components/AuthModal';
import LoginPage from './views/LoginPage';
import { GraduationCap } from 'lucide-react';

function MainLayout() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('discovery');
  
  // Dashboard & Auth states
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' or 'signup'

  // Modals state
  const [viewStudentId, setViewStudentId] = useState(null);
  const [collabTarget, setCollabTarget] = useState(null);
  const [uploadCertOpen, setUploadCertOpen] = useState(false);

  const handleOpenAuth = (mode = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  // 1. Initial Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-sky-400 flex items-center justify-center shadow-lg shadow-indigo-500/30">
          <GraduationCap className="w-7 h-7 text-white" />
        </div>
        <div className="inline-block w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-semibold text-slate-300">Loading SkillBridge Campus Portal...</p>
      </div>
    );
  }

  // 2. Unauthenticated: Show Login / Sign Up Page First!
  if (!user) {
    return <LoginPage />;
  }

  // 3. Authenticated: Show the Normal Application (Peoples page, navigation, sliding dashboard)
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between selection:bg-indigo-500 selection:text-white text-slate-100">
      <div>
        <Navbar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          onOpenDashboard={() => setIsDashboardOpen(true)}
          onOpenAuth={handleOpenAuth}
        />

        <main className="pb-16">
          {activeTab === 'discovery' && (
            <TalentDiscovery
              onSelectStudent={(id) => setViewStudentId(id)}
              onOpenCollab={(student) => setCollabTarget(student)}
            />
          )}

          {activeTab === 'profile' && (
            <StudentProfile
              studentId={null} // views own profile
              onOpenUploadCert={() => setUploadCertOpen(true)}
            />
          )}

          {activeTab === 'certificates' && (
            <CertificateVault
              onOpenUpload={() => setUploadCertOpen(true)}
            />
          )}

          {activeTab === 'opportunities' && (
            <OpportunitiesBoard />
          )}

          {activeTab === 'collaborations' && (
            <CollaborationsHub
              onOpenStudent={(id) => setViewStudentId(id)}
            />
          )}

          {activeTab === 'analytics' && (
            <CampusAnalytics />
          )}

          {activeTab === 'admin' && (
            <AdminPanel />
          )}
        </main>
      </div>

      {/* Sliding Dashboard Drawer */}
      <SlidingDashboard
        isOpen={isDashboardOpen}
        onClose={() => setIsDashboardOpen(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuth={handleOpenAuth}
      />

      {/* Sign In / Sign Up Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
      />

      {/* Student Details & WhatsApp Modal */}
      <StudentModal
        studentId={viewStudentId}
        onClose={() => setViewStudentId(null)}
        onOpenCollab={(student) => setCollabTarget(student)}
      />

      {/* Send Collaboration Request Modal */}
      <CollabModal
        targetStudent={collabTarget}
        onClose={() => setCollabTarget(null)}
        onSuccess={() => {}}
      />

      {/* Upload Certificate Modal */}
      <UploadCertModal
        isOpen={uploadCertOpen}
        onClose={() => setUploadCertOpen(false)}
        onSuccess={() => {
          setActiveTab('certificates');
        }}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">SkillBridge</span>
            <span>—</span>
            <span>Discover Talent. Connect Skills. Build Together.</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>FastAPI + MongoDB/Document Engine</span>
            <span>•</span>
            <span>React 19 + Tailwind CSS</span>
            <span>•</span>
            <span>Direct WhatsApp Redirects</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}
