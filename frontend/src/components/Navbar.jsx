import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import { 
  GraduationCap, 
  Menu, 
  LogIn, 
  LogOut 
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onOpenDashboard, onOpenAuth }) {
  const { user, logout } = useAuth();
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    const checkPending = async () => {
      try {
        const data = await api.getMyCollaborations();
        const pending = (data.incoming || []).filter(c => c.status === 'pending');
        setPendingCount(pending.length);
      } catch (err) {
        // Silently ignore poll errors
      }
    };
    checkPending();
    const interval = setInterval(checkPending, 3000);
    return () => clearInterval(interval);
  }, [user]);

  const pageTitles = {
    discovery: 'Talent Discovery',
    profile: 'My Portfolio',
    collaborations: 'Collaboration Requests',
    certificates: 'Certificates & Vault',
    opportunities: 'Opportunities Marketplace',
    analytics: 'Campus Skill Analytics',
    admin: 'Admin Control Center'
  };

  const roleColors = {
    student: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    faculty: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    recruiter: 'bg-amber-100 text-amber-800 border-amber-300',
    admin: 'bg-rose-100 text-rose-800 border-rose-300',
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-xs">
      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Left: Sliding Dashboard Toggle Button & Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenDashboard}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 transition flex items-center gap-2 font-bold text-xs border border-slate-200 shadow-2xs relative"
              title="Open Sliding Dashboard Menu"
            >
              <Menu className="w-5 h-5 text-indigo-600" />
              <span className="font-extrabold text-xs hidden sm:inline">Dashboard Menu</span>
              {pendingCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-white text-[10px] font-black animate-pulse">
                  {pendingCount}
                </span>
              )}
            </button>

            <div 
              onClick={() => setActiveTab('discovery')}
              className="flex items-center gap-2 cursor-pointer group shrink-0"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-base tracking-tight text-slate-900">SkillBridge</span>
                  <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">SSMS</span>
                </div>
              </div>
            </div>
          </div>

          {/* Center: Current Active View Indicator */}
          <div className="hidden md:flex items-center gap-2">
            <span className="text-xs font-medium text-slate-400">Current View:</span>
            <span className="text-xs font-bold text-indigo-800 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full shadow-2xs">
              {pageTitles[activeTab] || 'Talent Discovery'}
            </span>
          </div>

          {/* Right Area: Profile Card & Sign Out Button */}
          <div className="flex items-center gap-2 shrink-0">
            {user ? (
              <div className="flex items-center gap-2.5">
                <div 
                  onClick={() => setActiveTab('profile')}
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-full border border-slate-200 hover:border-indigo-300 hover:bg-slate-50 transition cursor-pointer"
                  title="View Your Profile"
                >
                  <img
                    src={user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.name}`}
                    alt={user.name}
                    className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200"
                  />
                  <div className="text-left hidden sm:block">
                    <div className="text-xs font-bold text-slate-900 leading-tight truncate max-w-[120px]">{user.name}</div>
                    <span className={`inline-block text-[9px] font-semibold uppercase px-1 py-0.1 rounded border ${roleColors[user.role] || 'bg-slate-100 text-slate-700'}`}>
                      {user.role}
                    </span>
                  </div>
                </div>

                <button
                  onClick={logout}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 text-xs font-semibold flex items-center gap-1.5 transition border border-slate-200"
                  title="Sign out to Login screen"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onOpenAuth('login')}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
                <button
                  onClick={() => onOpenAuth('signup')}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition"
                >
                  <span>Sign Up</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
