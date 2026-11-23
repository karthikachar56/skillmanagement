import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import { 
  X, 
  Compass, 
  User, 
  Award, 
  Users, 
  Briefcase, 
  Bot, 
  BarChart3, 
  ShieldCheck, 
  GraduationCap, 
  Sparkles, 
  LogIn, 
  LogOut, 
  ChevronRight, 
  Zap, 
  HelpCircle,
  Check
} from 'lucide-react';
import { WhatsAppIcon, openWhatsApp } from './BrandIcons';

export default function SlidingDashboard({ 
  isOpen, 
  onClose, 
  activeTab, 
  setActiveTab,
  onOpenAuth 
}) {
  const { user, logout } = useAuth();
  const [collabs, setCollabs] = useState([]);
  const [actionCollabId, setActionCollabId] = useState(null);

  const loadCollabs = async () => {
    if (!user) return;
    try {
      const data = await api.getMyCollaborations();
      setCollabs(data.incoming || []);
    } catch (err) {
      console.error('Failed to load collaborations', err);
    }
  };

  useEffect(() => {
    if (isOpen && user) {
      loadCollabs();
    }
  }, [isOpen, user]);

  const handleCollabAction = async (collabId, status) => {
    setActionCollabId(collabId);
    try {
      await api.updateCollabStatus(collabId, status);
      await loadCollabs();
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    } finally {
      setActionCollabId(null);
    }
  };

  const pendingCollabs = collabs.filter(c => c.status === 'pending');

  if (!isOpen) return null;

  const navItems = [
    { 
      id: 'discovery', 
      label: 'Talent Discovery', 
      desc: 'Search students by skill & department', 
      icon: Compass 
    },
    { 
      id: 'profile', 
      label: 'My Profile & Portfolio', 
      desc: 'Manage personal skills, projects & links', 
      icon: User 
    },
    { 
      id: 'collaborations', 
      label: 'Collaboration Requests', 
      desc: 'Accept or reject student project invitations', 
      icon: Users,
      badge: pendingCollabs.length > 0 ? `${pendingCollabs.length} New` : null
    },
    { 
      id: 'certificates', 
      label: 'Certificate Vault & Queue', 
      desc: 'Upload proofs & faculty verification queue', 
      icon: Award 
    },
    { 
      id: 'opportunities', 
      label: 'Opportunities Marketplace', 
      desc: 'Hackathons, internships & project needs', 
      icon: Briefcase 
    },
    { 
      id: 'analytics', 
      label: 'Campus Skill Analytics', 
      desc: 'College-wide trending technologies & metrics', 
      icon: BarChart3 
    },
  ];

  if (user?.role === 'admin' || user?.role === 'faculty') {
    navItems.push({
      id: 'admin',
      label: 'Admin Control Center',
      desc: 'Role permissions & platform oversight',
      icon: ShieldCheck
    });
  }

  const handleSelectPage = (id) => {
    setActiveTab(id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300"
      ></div>

      {/* Slide-out Drawer Panel */}
      <div className="absolute inset-y-0 left-0 max-w-full flex">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between transform transition-all ease-in-out duration-300">
          {/* Top Header */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-sky-400 flex items-center justify-center text-white shadow-md">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-base tracking-tight">SkillBridge</span>
                  <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-indigo-500/30 text-indigo-300 border border-indigo-400/40">
                    Dashboard
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">Sliding Navigation & Control</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition"
              title="Close Dashboard"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Profile Card Snippet */}
          <div className="p-4 bg-gradient-to-r from-indigo-50 to-slate-50 border-b border-slate-200">
            {user ? (
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.name}`}
                    alt={user.name}
                    className="w-11 h-11 rounded-2xl object-cover ring-2 ring-indigo-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm text-slate-900 truncate">{user.name}</h3>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-bold uppercase px-2 py-0.2 rounded-full bg-indigo-100 text-indigo-800">
                        {user.role}
                      </span>
                      {user.whatsapp && (
                        <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-0.5">
                          <WhatsAppIcon className="w-3 h-3 text-emerald-600" />
                          <span>Linked</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleSelectPage('profile')}
                  className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 text-xs font-bold text-slate-700 hover:text-indigo-600 shadow-2xs shrink-0"
                >
                  View & Edit Profile
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Guest User</h4>
                  <p className="text-xs text-slate-500">Sign in to access full features</p>
                </div>
                <button
                  onClick={() => { onClose(); onOpenAuth('login'); }}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-xs"
                >
                  Sign In
                </button>
              </div>
            )}
          </div>

          {/* Navigation Links List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 block mb-2">
              Select Page Option:
            </span>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectPage(item.id)}
                  className={`w-full p-3 rounded-2xl text-left transition flex items-center justify-between gap-3 group ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-indigo-600 group-hover:bg-white'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs sm:text-sm truncate">{item.label}</span>
                        {item.badge && (
                          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-2xs ${
                            isActive ? 'bg-amber-300 text-amber-900' : 'bg-amber-500 text-white'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                        {item.aiBadge && (
                          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full flex items-center gap-0.5 ${
                            isActive ? 'bg-amber-300 text-amber-900' : 'bg-amber-100 text-amber-800'
                          }`}>
                            <Sparkles className="w-2.5 h-2.5" /> AI
                          </span>
                        )}
                      </div>
                      <p className={`text-[11px] truncate ${isActive ? 'text-indigo-100' : 'text-slate-400'}`}>
                        {item.desc}
                      </p>
                    </div>
                  </div>

                  <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${
                    isActive ? 'text-white translate-x-0.5' : 'text-slate-300 group-hover:text-slate-500'
                  }`} />
                </button>
              );
            })}

            {/* Direct WhatsApp Contact Button */}
            <div className="pt-4 border-t border-slate-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 block mb-2">
                Need Help or Team Guidance?
              </span>
              <button
                type="button"
                onClick={() => openWhatsApp('+919876543210', 'SkillBridge Team', 'Hello! I need assistance with SkillBridge.')}
                className="w-full p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-left transition flex items-center justify-between gap-3 shadow-2xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
                    <WhatsAppIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-xs block text-emerald-900">Direct WhatsApp Helpdesk</span>
                    <span className="text-[10px] text-emerald-700">Chat with campus coordinator</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900">
                  Online
                </span>
              </button>
            </div>
          </div>

          {/* Bottom Actions Footer */}
          <div className="p-4 border-t border-slate-100 bg-slate-50">
            {user ? (
              <button
                onClick={() => { logout(); onClose(); }}
                className="w-full py-2.5 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold flex items-center justify-center gap-2 transition"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            ) : (
              <button
                onClick={() => { onClose(); onOpenAuth('login'); }}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In / Sign Up</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
