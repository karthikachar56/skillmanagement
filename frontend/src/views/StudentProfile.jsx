import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import { 
  User, 
  Award, 
  FolderGit2, 
  Plus, 
  Trash2, 
  ExternalLink, 
  Globe, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Zap, 
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Edit3,
  Phone,
  Camera,
  Save,
  X,
  RefreshCw,
  Check,
  Share2,
  BookOpen,
  Briefcase
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../components/BrandIcons';

export default function StudentProfile({ studentId, onOpenUploadCert }) {
  const { user: currentUser, refreshUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Modals state
  const [showAddSkill, setShowAddSkill] = useState(false);
  const [newSkill, setNewSkill] = useState({ name: '', category: 'technical', proficiency: 'intermediate' });
  const [showAddProject, setShowAddProject] = useState(false);
  const [newProject, setNewProject] = useState({ title: '', description: '', skills_used: '', live_url: '', github_url: '', role: 'Lead Developer' });
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioText, setBioText] = useState('');
  const [phoneText, setPhoneText] = useState('');

  // Comprehensive Edit Profile Modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [editTab, setEditTab] = useState('general'); // 'general', 'avatar', 'contact', 'social', 'bio'
  const [editForm, setEditForm] = useState({
    name: '',
    department: 'Computer Science & Engineering',
    semester: 5,
    srn: '',
    title: '',
    bio: '',
    phone: '',
    whatsapp: '',
    avatar: '',
    github_url: '',
    linkedin_url: '',
    portfolio_url: '',
    available_for_collaboration: true
  });

  const targetId = studentId || currentUser?.id;
  const isOwnProfile = !studentId || studentId === currentUser?.id;

  const loadProfile = async () => {
    setLoading(true);
    try {
      if (targetId) {
        const data = await api.getStudentProfile(targetId);
        setProfile(data);
        setBioText(data.bio || '');
        setPhoneText(data.phone || data.whatsapp || '');
      }
    } catch (err) {
      console.error('Failed to load profile', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [targetId]);

  const handleOpenEditModal = () => {
    if (!profile) return;
    setEditForm({
      name: profile.name || '',
      department: profile.department || 'Computer Science & Engineering',
      semester: profile.semester || 5,
      srn: profile.srn || '',
      title: profile.title || '',
      bio: profile.bio || '',
      phone: profile.phone || profile.whatsapp || '',
      whatsapp: profile.whatsapp || profile.phone || '',
      avatar: profile.avatar || '',
      github_url: profile.github_url || '',
      linkedin_url: profile.linkedin_url || '',
      portfolio_url: profile.portfolio_url || '',
      available_for_collaboration: profile.available_for_collaboration ?? true
    });
    setEditTab('general');
    setShowEditModal(true);
  };

  const handleSaveFullProfile = async (e) => {
    if (e) e.preventDefault();
    if (!editForm.name.trim()) {
      alert('Please enter your full name');
      return;
    }
    setSavingProfile(true);
    try {
      const payload = {
        name: editForm.name.trim(),
        department: editForm.department?.trim() || 'Computer Science & Engineering',
        semester: parseInt(editForm.semester, 10) || 1,
        srn: editForm.srn?.trim() || '',
        title: editForm.title?.trim() || '',
        bio: editForm.bio?.trim() || '',
        phone: editForm.phone?.trim() || '',
        whatsapp: (editForm.whatsapp || editForm.phone)?.trim() || '',
        avatar: editForm.avatar?.trim() || '',
        github_url: editForm.github_url?.trim() || '',
        linkedin_url: editForm.linkedin_url?.trim() || '',
        portfolio_url: editForm.portfolio_url?.trim() || '',
        available_for_collaboration: Boolean(editForm.available_for_collaboration)
      };

      const updated = await api.updateProfile(payload);
      setProfile(prev => ({ 
        ...prev, 
        ...updated, 
        phone: payload.phone, 
        whatsapp: payload.whatsapp,
        bio: payload.bio,
        department: payload.department,
        semester: payload.semester,
        srn: payload.srn,
        title: payload.title,
        avatar: payload.avatar,
        github_url: payload.github_url,
        linkedin_url: payload.linkedin_url,
        portfolio_url: payload.portfolio_url,
        available_for_collaboration: payload.available_for_collaboration
      }));
      setBioText(payload.bio);
      setPhoneText(payload.phone);
      setShowEditModal(false);
      await refreshUser();
    } catch (err) {
      alert('Failed to update profile: ' + (err.message || 'Unknown error'));
    } finally {
      setSavingProfile(false);
    }
  };

  const generateRandomAvatar = (style = 'bottts') => {
    const seed = Math.random().toString(36).substring(2, 9);
    const newAvatar = `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}`;
    setEditForm(prev => ({ ...prev, avatar: newAvatar }));
  };

  const handleToggleAvailability = async () => {
    try {
      const updated = !profile.available_for_collaboration;
      await api.updateProfile({ available_for_collaboration: updated });
      setProfile(prev => ({ ...prev, available_for_collaboration: updated }));
      refreshUser();
    } catch (err) {
      alert('Failed to update availability: ' + err.message);
    }
  };

  const handleSaveBio = async () => {
    try {
      await api.updateProfile({ 
        bio: bioText,
        phone: phoneText,
        whatsapp: phoneText 
      });
      setProfile(prev => ({ 
        ...prev, 
        bio: bioText, 
        phone: phoneText, 
        whatsapp: phoneText 
      }));
      setIsEditingBio(false);
      refreshUser();
    } catch (err) {
      alert('Failed to update profile: ' + err.message);
    }
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!newSkill.name.trim()) return;
    try {
      await api.addSkill(newSkill);
      setShowAddSkill(false);
      setNewSkill({ name: '', category: 'technical', proficiency: 'intermediate' });
      loadProfile();
      refreshUser();
    } catch (err) {
      alert('Failed to add skill: ' + err.message);
    }
  };

  const handleDeleteSkill = async (skillName) => {
    if (!confirm(`Remove ${skillName} from your profile?`)) return;
    try {
      await api.deleteSkill(skillName);
      loadProfile();
      refreshUser();
    } catch (err) {
      alert('Failed to remove skill: ' + err.message);
    }
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    if (!newProject.title.trim()) return;
    try {
      const skillsArray = newProject.skills_used
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      await api.addProject({
        title: newProject.title,
        description: newProject.description,
        skills_used: skillsArray,
        live_url: newProject.live_url || null,
        github_url: newProject.github_url || null,
        role: newProject.role
      });
      setShowAddProject(false);
      setNewProject({ title: '', description: '', skills_used: '', live_url: '', github_url: '', role: 'Lead Developer' });
      loadProfile();
      refreshUser();
    } catch (err) {
      alert('Failed to add project: ' + err.message);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!confirm('Delete this project showcase?')) return;
    try {
      await api.deleteProject(projectId);
      loadProfile();
      refreshUser();
    } catch (err) {
      alert('Failed to delete project: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="inline-block w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-3 text-sm font-medium text-slate-500">Loading student profile & credentials...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center">
        <p className="text-slate-500">Profile could not be found.</p>
      </div>
    );
  }

  const cred = profile.credibility || { score: 50, badge: 'Student Talent', breakdown: {} };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner Card */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="h-32 bg-gradient-to-r from-indigo-600 via-indigo-500 to-sky-500 relative">
          <div className="absolute right-4 top-4 flex items-center gap-2">
            {isOwnProfile && (
              <>
                <button
                  type="button"
                  onClick={handleOpenEditModal}
                  className="px-3.5 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 bg-white text-indigo-700 hover:bg-slate-50 shadow-sm"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Profile</span>
                </button>
                <button
                  onClick={handleToggleAvailability}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 shadow-sm ${
                    profile.available_for_collaboration
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-800/80 text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {profile.available_for_collaboration ? (
                    <>
                      <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                      <span>Available for Collabs</span>
                    </>
                  ) : (
                    <span>Busy / Offline</span>
                  )}
                </button>
              </>
            )}
          </div>
        </div>

        <div className="px-6 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-14 mb-4">
            <div className="flex items-end gap-4">
              <div className="relative group">
                <img
                  src={profile.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${profile.name}`}
                  alt={profile.name}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-4 ring-white shadow-md bg-white shrink-0"
                />
                {isOwnProfile && (
                  <button
                    type="button"
                    onClick={handleOpenEditModal}
                    className="absolute inset-0 bg-slate-900/60 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[11px] font-bold gap-1 cursor-pointer"
                    title="Change Avatar"
                  >
                    <Camera className="w-5 h-5 text-indigo-200" />
                    <span>Change</span>
                  </button>
                )}
              </div>
              <div className="pt-2">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-extrabold text-slate-900">{profile.name}</h1>
                  {isOwnProfile && (
                    <button
                      type="button"
                      onClick={handleOpenEditModal}
                      className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-indigo-600 transition"
                      title="Edit Profile"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  )}
                  <span className="text-xs uppercase font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {profile.role}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500">{profile.department}</p>
                {profile.title && (
                  <p className="text-xs font-semibold text-indigo-600 mt-0.5">{profile.title}</p>
                )}
                <div className="flex items-center gap-2 mt-1 text-xs text-slate-400 font-medium">
                  <span>Semester {profile.semester || 4}</span>
                  <span>•</span>
                  <span className="font-mono">{profile.srn || 'SRN'}</span>
                  {profile.phone && (
                    <>
                      <span>•</span>
                      <span>Phone: {profile.phone}</span>
                    </>
                  )}
                  <span>•</span>
                  <span>{profile.profile_views || 0} profile views</span>
                </div>
              </div>
            </div>

            {/* Social / Portfolios & Profile Actions */}
            <div className="flex flex-wrap items-center gap-2 pt-2 sm:pt-0">
              {isOwnProfile && (
                <button
                  type="button"
                  onClick={handleOpenEditModal}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition flex items-center gap-1.5 text-xs font-bold shadow-xs"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              )}
              {profile.github_url && (
                <a
                  href={profile.github_url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
                  title="GitHub"
                >
                  <GithubIcon className="w-4 h-4" />
                </a>
              )}
              {profile.linkedin_url && (
                <a
                  href={profile.linkedin_url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
                  title="LinkedIn"
                >
                  <LinkedinIcon className="w-4 h-4" />
                </a>
              )}
              {profile.portfolio_url && (
                <a
                  href={profile.portfolio_url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
                  title="Personal Portfolio"
                >
                  <Globe className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Bio Section */}
          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">About & Focus</span>
              {isOwnProfile && (
                <button
                  type="button"
                  onClick={handleOpenEditModal}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Profile & Contact</span>
                </button>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {profile.bio || 'No bio provided yet. Click "Edit Profile" to share your technical interests, projects, and goals.'}
            </p>
          </div>
        </div>
      </div>

      {/* Credibility Score Breakdown */}
      <div className="bg-gradient-to-br from-indigo-50 via-white to-sky-50 rounded-3xl border border-indigo-100 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-indigo-100/60">
          <div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg font-extrabold text-slate-900">Skill Credibility Score</h2>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-600 text-white">
                {cred.badge}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Evidence-based ranking calculated from verified certificates, completed projects, and skill depth.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-3xl font-black text-indigo-700">{cred.score}</span>
            <span className="text-sm font-semibold text-slate-400">/ 100 PTS</span>
          </div>
        </div>

        {/* Breakdown Pillars */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
          <div className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Verified Proofs</span>
            <span className="text-lg font-black text-slate-800 mt-1 block">
              {cred.breakdown?.verified_certificates || 0} pts
            </span>
            <span className="text-[10px] text-slate-500">From official credentials</span>
          </div>
          <div className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Portfolio Projects</span>
            <span className="text-lg font-black text-slate-800 mt-1 block">
              {cred.breakdown?.project_portfolio || 0} pts
            </span>
            <span className="text-[10px] text-slate-500">Shipped code & links</span>
          </div>
          <div className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Skill Depth</span>
            <span className="text-lg font-black text-slate-800 mt-1 block">
              {cred.breakdown?.skill_depth || 0} pts
            </span>
            <span className="text-[10px] text-slate-500">Proficiency weighted</span>
          </div>
          <div className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Endorsements</span>
            <span className="text-lg font-black text-slate-800 mt-1 block">
              {cred.breakdown?.peer_faculty_endorsements || 0} pts
            </span>
            <span className="text-[10px] text-slate-500">Faculty & peer vouches</span>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Skills & Certificates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Skills Section */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-bold text-slate-900">Skills & Competencies</h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {(profile.skills || []).length}
              </span>
            </div>
            {isOwnProfile && (
              <button
                onClick={() => setShowAddSkill(true)}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Skill</span>
              </button>
            )}
          </div>

          {(profile.skills || []).length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No skills listed yet.</p>
          ) : (
            <div className="space-y-2.5">
              {(profile.skills || []).map((sk, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs sm:text-sm font-bold text-slate-800">{sk.name}</span>
                        {sk.verified && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.2 rounded bg-sky-100 text-sky-800">
                            <CheckCircle2 className="w-3 h-3 text-sky-600" /> Verified
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                        {sk.category} • {sk.proficiency}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-slate-500 bg-white px-2 py-1 rounded-md border border-slate-200">
                      ★ {sk.endorsements || 0}
                    </span>
                    {isOwnProfile && (
                      <button
                        onClick={() => handleDeleteSkill(sk.name)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                        title="Delete skill"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Certificates & Achievements */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg font-bold text-slate-900">Verified Certificates</h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {(profile.certificates || []).length}
              </span>
            </div>
            {isOwnProfile && (
              <button
                onClick={onOpenUploadCert}
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold flex items-center gap-1 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Upload Proof</span>
              </button>
            )}
          </div>

          {(profile.certificates || []).length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No certificates uploaded yet.</p>
          ) : (
            <div className="space-y-3">
              {(profile.certificates || []).map((cert) => {
                const isVerified = cert.status === 'verified';
                const isPending = cert.status === 'pending';

                return (
                  <div
                    key={cert.id}
                    className="p-3.5 rounded-2xl border border-slate-200 bg-white hover:shadow-xs transition space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900">{cert.title}</h4>
                        <p className="text-xs text-slate-500">{cert.issuer} • Issued {cert.issue_date}</p>
                      </div>
                      {isVerified && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                          <CheckCircle2 className="w-3 h-3" /> Verified
                        </span>
                      )}
                      {isPending && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 shrink-0">
                          <Clock className="w-3 h-3" /> Pending Review
                        </span>
                      )}
                      {cert.status === 'rejected' && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 shrink-0">
                          <XCircle className="w-3 h-3" /> Rejected
                        </span>
                      )}
                    </div>

                    {cert.reviewer_notes && (
                      <p className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg italic">
                        "{cert.reviewer_notes}" — <span className="font-semibold text-slate-700">{cert.reviewed_by}</span>
                      </p>
                    )}

                    {cert.credential_url && (
                      <a
                        href={cert.credential_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1"
                      >
                        <span>View Credential Link</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Projects Showcase Full Width */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <FolderGit2 className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900">Projects & Proof of Work</h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              {(profile.projects || []).length}
            </span>
          </div>
          {isOwnProfile && (
            <button
              onClick={() => setShowAddProject(true)}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Project</span>
            </button>
          )}
        </div>

        {(profile.projects || []).length === 0 ? (
          <p className="text-xs text-slate-400 py-8 text-center">No projects showcased yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(profile.projects || []).map((proj) => (
              <div
                key={proj.id}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-xs transition space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-sm sm:text-base text-slate-900">{proj.title}</h3>
                    {isOwnProfile && (
                      <button
                        onClick={() => handleDeleteProject(proj.id)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{proj.description}</p>
                  
                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {(proj.skills_used || []).map((sk, i) => (
                      <span key={i} className="text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2 text-xs font-semibold">
                  {proj.live_url && (
                    <a
                      href={proj.live_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-indigo-600 hover:underline flex items-center gap-1"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>Live Demo</span>
                    </a>
                  )}
                  {proj.github_url && (
                    <a
                      href={proj.github_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-slate-700 hover:underline flex items-center gap-1"
                    >
                      <GithubIcon className="w-3.5 h-3.5" />
                      <span>Repository</span>
                    </a>
                  )}
                  {proj.date && (
                    <span className="text-[11px] text-slate-400 ml-auto font-normal">{proj.date}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Skill Modal */}
      {showAddSkill && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Add Skill to Profile</h3>
            <form onSubmit={handleAddSkill} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Skill Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Python, Figma, React, Kotlin"
                  value={newSkill.name}
                  onChange={(e) => setNewSkill(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full text-xs sm:text-sm p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                <select
                  value={newSkill.category}
                  onChange={(e) => setNewSkill(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full text-xs sm:text-sm p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                >
                  <option value="technical">Technical Programming</option>
                  <option value="design">Design & UI/UX</option>
                  <option value="data_ai">AI & Data Science</option>
                  <option value="core">Core Engineering</option>
                  <option value="non_technical">Non-Technical & Leadership</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Proficiency Level</label>
                <select
                  value={newSkill.proficiency}
                  onChange={(e) => setNewSkill(prev => ({ ...prev, proficiency: e.target.value }))}
                  className="w-full text-xs sm:text-sm p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddSkill(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  Save Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Project Modal */}
      {showAddProject && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Add Project Showcase</h3>
            <form onSubmit={handleAddProject} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Project Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Autonomous Campus Delivery Drone"
                  value={newProject.title}
                  onChange={(e) => setNewProject(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full text-xs sm:text-sm p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  required
                  rows={3}
                  placeholder="What problem does it solve? What architecture did you use?"
                  value={newProject.description}
                  onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full text-xs sm:text-sm p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Skills Used (comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Python, FastAPI, React, Docker"
                  value={newProject.skills_used}
                  onChange={(e) => setNewProject(prev => ({ ...prev, skills_used: e.target.value }))}
                  className="w-full text-xs sm:text-sm p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Live Demo URL</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={newProject.live_url}
                    onChange={(e) => setNewProject(prev => ({ ...prev, live_url: e.target.value }))}
                    className="w-full text-xs sm:text-sm p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">GitHub Repo URL</label>
                  <input
                    type="url"
                    placeholder="https://github.com/..."
                    value={newProject.github_url}
                    onChange={(e) => setNewProject(prev => ({ ...prev, github_url: e.target.value }))}
                    className="w-full text-xs sm:text-sm p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddProject(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Comprehensive Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl my-auto border border-slate-100 max-h-[92vh] flex flex-col justify-between">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-2xs">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">Edit Your Profile</h3>
                  <p className="text-xs text-slate-500">Update your student credentials, contact info, photo & links</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs inside Modal */}
            <div className="flex gap-1.5 sm:gap-2 border-b border-slate-100 py-3 overflow-x-auto shrink-0">
              {[
                { id: 'general', label: 'Academic & Info', icon: User },
                { id: 'contact', label: 'Contact Info', icon: Phone },
                { id: 'avatar', label: 'Avatar & Photo', icon: Camera },
                { id: 'social', label: 'Links & Socials', icon: Globe },
                { id: 'bio', label: 'Bio & Collab', icon: BookOpen }
              ].map(t => {
                const Icon = t.icon;
                const active = editTab === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setEditTab(t.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                      active
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Form Body - Scrollable */}
            <form onSubmit={handleSaveFullProfile} className="space-y-4 overflow-y-auto py-3 pr-1 flex-1">
              {/* Tab 1: General & Academic */}
              {editTab === 'general' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={editForm.name}
                        onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g. Alex Rivera"
                        className="w-full text-xs sm:text-sm p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Student Registration No. (SRN)
                      </label>
                      <input
                        type="text"
                        value={editForm.srn}
                        onChange={(e) => setEditForm(prev => ({ ...prev, srn: e.target.value }))}
                        placeholder="e.g. PES1UG22CS104"
                        className="w-full text-xs sm:text-sm p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Department
                      </label>
                      <select
                        value={editForm.department}
                        onChange={(e) => setEditForm(prev => ({ ...prev, department: e.target.value }))}
                        className="w-full text-xs sm:text-sm p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                      >
                        <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                        <option value="Artificial Intelligence & Data Science">Artificial Intelligence & Data Science</option>
                        <option value="Information Science & Engineering">Information Science & Engineering</option>
                        <option value="Electronics & Communication">Electronics & Communication</option>
                        <option value="Electrical & Electronics">Electrical & Electronics</option>
                        <option value="Mechanical Engineering">Mechanical Engineering</option>
                        <option value="Cybersecurity & Cloud Computing">Cybersecurity & Cloud Computing</option>
                        <option value="Human-Computer Interaction & Design">Human-Computer Interaction & Design</option>
                        <option value="Management Studies">Management Studies</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Semester (Current Term)
                      </label>
                      <select
                        value={editForm.semester}
                        onChange={(e) => setEditForm(prev => ({ ...prev, semester: parseInt(e.target.value, 10) }))}
                        className="w-full text-xs sm:text-sm p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                          <option key={s} value={s}>Semester {s}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Headline / Specialization Title
                    </label>
                    <input
                      type="text"
                      value={editForm.title}
                      onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g. Distributed Systems Enthusiast & Full-Stack Developer"
                      className="w-full text-xs sm:text-sm p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">This brief tagline appears on your student discovery card.</p>
                  </div>
                </div>
              )}

              {/* Tab 2: Contact Info */}
              {editTab === 'contact' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Contact / Phone Number
                    </label>
                    <input
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) => {
                        const val = e.target.value;
                        setEditForm(prev => ({ ...prev, phone: val, whatsapp: val }));
                      }}
                      placeholder="+91 98765 43210"
                      className="w-full text-xs sm:text-sm p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
                    />
                    <span className="text-[11px] text-slate-500 mt-1 block">
                      Include country code (e.g. +91 9876543210 or +1 4155552671)
                    </span>
                  </div>

                  {editForm.phone && (
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-slate-700">
                        <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                        <span>Saved Contact:</span>
                        <span className="font-mono text-slate-900 font-semibold">{editForm.phone}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 3: Avatar & Photo */}
              {editTab === 'avatar' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                    <img
                      src={editForm.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${editForm.name || 'Student'}`}
                      alt="Avatar preview"
                      className="w-20 h-20 rounded-2xl object-cover ring-2 ring-indigo-400 bg-white shrink-0 shadow-sm"
                    />
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-slate-800">Live Avatar Preview</h4>
                      <p className="text-[11px] text-slate-500">
                        Choose one of the instant animated avatar generators or paste any custom image URL.
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Custom Avatar / Image URL
                    </label>
                    <input
                      type="url"
                      value={editForm.avatar}
                      onChange={(e) => setEditForm(prev => ({ ...prev, avatar: e.target.value }))}
                      placeholder="https://images.unsplash.com/... or https://api.dicebear.com/..."
                      className="w-full text-xs sm:text-sm p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">
                      Generate Instant Styles (Click to preview):
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <button
                        type="button"
                        onClick={() => generateRandomAvatar('bottts')}
                        className="p-2.5 rounded-xl border border-slate-200 hover:border-indigo-400 bg-white text-xs font-semibold text-slate-700 hover:text-indigo-600 transition flex items-center justify-center gap-1.5 shadow-2xs"
                      >
                        <span>🤖 Robot Bots</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => generateRandomAvatar('adventurer')}
                        className="p-2.5 rounded-xl border border-slate-200 hover:border-indigo-400 bg-white text-xs font-semibold text-slate-700 hover:text-indigo-600 transition flex items-center justify-center gap-1.5 shadow-2xs"
                      >
                        <span>🧑 Adventurer</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => generateRandomAvatar('avataaars')}
                        className="p-2.5 rounded-xl border border-slate-200 hover:border-indigo-400 bg-white text-xs font-semibold text-slate-700 hover:text-indigo-600 transition flex items-center justify-center gap-1.5 shadow-2xs"
                      >
                        <span>👤 Avataaars</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => generateRandomAvatar('lorelei')}
                        className="p-2.5 rounded-xl border border-slate-200 hover:border-indigo-400 bg-white text-xs font-semibold text-slate-700 hover:text-indigo-600 transition flex items-center justify-center gap-1.5 shadow-2xs"
                      >
                        <span>✨ Lorelei</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 4: Links & Socials */}
              {editTab === 'social' && (
                <div className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                      <GithubIcon className="w-3.5 h-3.5" />
                      <span>GitHub Profile URL</span>
                    </label>
                    <input
                      type="url"
                      value={editForm.github_url}
                      onChange={(e) => setEditForm(prev => ({ ...prev, github_url: e.target.value }))}
                      placeholder="https://github.com/username"
                      className="w-full text-xs sm:text-sm p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                      <LinkedinIcon className="w-3.5 h-3.5" />
                      <span>LinkedIn Profile URL</span>
                    </label>
                    <input
                      type="url"
                      value={editForm.linkedin_url}
                      onChange={(e) => setEditForm(prev => ({ ...prev, linkedin_url: e.target.value }))}
                      placeholder="https://linkedin.com/in/username"
                      className="w-full text-xs sm:text-sm p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5" />
                      <span>Personal Portfolio / Website URL</span>
                    </label>
                    <input
                      type="url"
                      value={editForm.portfolio_url}
                      onChange={(e) => setEditForm(prev => ({ ...prev, portfolio_url: e.target.value }))}
                      placeholder="https://yourportfolio.dev"
                      className="w-full text-xs sm:text-sm p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Tab 5: Bio & Collaboration */}
              {editTab === 'bio' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Bio & Engineering Summary
                    </label>
                    <textarea
                      rows={4}
                      value={editForm.bio}
                      onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                      placeholder="Tell students and mentors about your interests, technical stack, hackathon experience, and what kinds of projects you love building..."
                      className="w-full text-xs sm:text-sm p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">
                      A clear, informative bio boosts your credibility score and attracts relevant teammates.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-indigo-900">Collaboration Availability</h4>
                      <p className="text-[11px] text-indigo-700">Show a green "Available for Collabs" badge on your card</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editForm.available_for_collaboration}
                        onChange={(e) => setEditForm(prev => ({ ...prev, available_for_collaboration: e.target.checked }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between shrink-0">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm flex items-center gap-1.5 transition disabled:opacity-50"
                >
                  {savingProfile ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Profile Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
