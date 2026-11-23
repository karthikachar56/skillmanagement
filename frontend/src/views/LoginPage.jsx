import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  GraduationCap, 
  LogIn, 
  UserPlus, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Users, 
  Award, 
  Zap,
  Bot
} from 'lucide-react';
import { WhatsAppIcon } from '../components/BrandIcons';

export default function LoginPage() {
  const { login, register, demoUsers, switchDemoUser } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' or 'signup'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Login inputs
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup inputs
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [semester, setSemester] = useState(4);
  const [srn, setSrn] = useState('');
  const [phone, setPhone] = useState('');
  const [organization, setOrganization] = useState('');
  const [title, setTitle] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(loginEmail, loginPassword);
    } catch (err) {
      setError(err.message || 'Login failed. Please check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const cleanPhone = phone.trim();
      await register({
        name,
        email,
        password,
        role,
        department: role === 'student' || role === 'faculty' ? department : null,
        semester: role === 'student' ? Number(semester) : null,
        srn: role === 'student' ? srn : null,
        phone: cleanPhone || null,
        whatsapp: cleanPhone || null,
        organization: role === 'recruiter' ? organization : null,
        title: role === 'faculty' || role === 'recruiter' ? title : null,
      });
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoClick = async (userId) => {
    setLoading(true);
    setError('');
    try {
      await switchDemoUser(userId);
    } catch (err) {
      setError('Quick login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-indigo-500 selection:text-white">
      {/* Background Glowing Ambient Orbs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-sky-500/20 blur-3xl pointer-events-none"></div>

      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        
        {/* Left Column: Brand & Value Proposition Hero */}
        <div className="lg:col-span-6 space-y-6 text-white text-center lg:text-left pr-0 lg:pr-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-xs font-semibold text-indigo-300">
            <GraduationCap className="w-4 h-4 text-indigo-400" />
            <span>Student Skill Management System (SSMS)</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
            Skill<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-sky-400">Bridge</span>
          </h1>

          <p className="text-lg sm:text-xl font-medium text-slate-300 leading-relaxed">
            Discover Talent. Connect Skills. Build Together.
          </p>

          <p className="text-sm text-slate-400 leading-relaxed max-w-xl mx-auto lg:mx-0">
            The centralized campus talent networking, certificate verification, and student recruitment platform. Sign in to browse student portfolios, form hackathon squads, and connect via direct WhatsApp chat.
          </p>

          {/* Value Pillars List */}
          <div className="space-y-3 pt-2 text-left max-w-lg mx-auto lg:mx-0">
            <div className="flex items-start gap-3 bg-white/5 border border-white/10 p-3.5 rounded-2xl backdrop-blur-xs">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-200">Campus Talent Discovery</h4>
                <p className="text-xs text-slate-400">Search peers by technical skill, proficiency, department, and collaboration availability.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-white/5 border border-white/10 p-3.5 rounded-2xl backdrop-blur-xs">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-200">Verified Certificate Vault</h4>
                <p className="text-xs text-slate-400">Faculty-audited credentials with authentic verification badges and Credibility Scores.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-white/5 border border-white/10 p-3.5 rounded-2xl backdrop-blur-xs">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                <WhatsAppIcon className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-200">Instant WhatsApp Chat Redirect</h4>
                <p className="text-xs text-slate-400">Click student WhatsApp tags to launch direct conversations for hackathons and projects.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Authentication Card */}
        <div className="lg:col-span-6 max-w-md w-full mx-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6">
            
            {/* Header Tabs: Sign In / Sign Up */}
            <div className="flex bg-slate-100 p-1.5 rounded-2xl text-xs font-bold">
              <button
                type="button"
                onClick={() => { setMode('login'); setError(''); }}
                className={`flex-1 py-2.5 rounded-xl transition flex items-center justify-center gap-2 ${
                  mode === 'login'
                    ? 'bg-white text-indigo-700 shadow-sm font-extrabold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </button>
              <button
                type="button"
                onClick={() => { setMode('signup'); setError(''); }}
                className={`flex-1 py-2.5 rounded-xl transition flex items-center justify-center gap-2 ${
                  mode === 'signup'
                    ? 'bg-white text-indigo-700 shadow-sm font-extrabold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                <span>Create Account</span>
              </button>
            </div>

            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-xl font-medium">
                {error}
              </div>
            )}

            {/* TAB 1: SIGN IN FORM */}
            {mode === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      required
                      placeholder="student@campus.edu"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <span>{loading ? 'Authenticating...' : 'Sign In to Campus Network'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Quick 1-Click Demo Logins */}
                <div className="pt-4 border-t border-slate-100 space-y-2.5">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block text-center">
                    Instant 1-Click Persona Logins:
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {demoUsers.map((du) => (
                      <button
                        key={du.id}
                        type="button"
                        onClick={() => handleDemoClick(du.id)}
                        className="p-2.5 rounded-xl bg-slate-50 hover:bg-indigo-50 hover:border-indigo-300 border border-slate-200 text-left transition flex items-center gap-2 text-xs group"
                      >
                        <img
                          src={du.avatar}
                          alt={du.name}
                          className="w-7 h-7 rounded-full object-cover shrink-0 ring-1 ring-slate-200"
                        />
                        <div className="truncate min-w-0">
                          <div className="font-bold text-slate-900 truncate leading-tight group-hover:text-indigo-600">
                            {du.name.split(' ')[0]}
                          </div>
                          <span className="text-[9px] uppercase font-bold text-slate-400">
                            {du.role}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </form>
            ) : (
              /* TAB 2: SIGN UP FORM */
              <form onSubmit={handleSignupSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Chen"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      placeholder="student@campus.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="password"
                      required
                      placeholder="Min 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Role Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Select Your Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full py-2 px-3 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white font-medium"
                  >
                    <option value="student">Student (Talent & Collaborator)</option>
                    <option value="faculty">Faculty / Mentor (Reviewer)</option>
                    <option value="recruiter">Recruiter / Organization</option>
                    <option value="admin">Platform Administrator</option>
                  </select>
                </div>

                {/* WhatsApp Number Field */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                    <span>WhatsApp Contact Number</span>
                    <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                      <WhatsAppIcon className="w-3 h-3 text-emerald-600" /> Direct chat
                    </span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-emerald-500 absolute left-3.5 top-3" />
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 text-xs sm:text-sm border border-emerald-300 rounded-xl focus:ring-2 focus:ring-emerald-500 bg-emerald-50/20 font-medium"
                    />
                  </div>
                  <span className="text-[9px] text-slate-400 mt-0.5 block">
                    Other students can click your WhatsApp tag to start chats directly.
                  </span>
                </div>

                {/* Student specific fields */}
                {role === 'student' && (
                  <div className="grid grid-cols-2 gap-2 pt-0.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Department</label>
                      <select
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="w-full py-2 px-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-white"
                      >
                        <option value="Computer Science & Engineering">CSE</option>
                        <option value="Information Science & Engineering">ISE</option>
                        <option value="Artificial Intelligence & Data Science">AI & DS</option>
                        <option value="Electronics & Communication Engineering">ECE</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">SRN / Roll No</label>
                      <input
                        type="text"
                        placeholder="PES2UG..."
                        value={srn}
                        onChange={(e) => setSrn(e.target.value)}
                        className="w-full py-2 px-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
                >
                  <span>{loading ? 'Creating Account...' : 'Complete Registration'}</span>
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
