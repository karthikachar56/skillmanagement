import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import { 
  Briefcase, 
  Trophy, 
  Code2, 
  MapPin, 
  Calendar, 
  Users, 
  Plus, 
  Sparkles, 
  ExternalLink,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';

export default function OpportunitiesBoard() {
  const { user } = useAuth();
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('');
  
  // Create Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newOpp, setNewOpp] = useState({
    title: '',
    organization: '',
    type: 'hackathon',
    description: '',
    required_skills: '',
    stipend_prize: '',
    deadline: '',
    location: 'Campus / Remote'
  });

  // Apply Modal
  const [applyingOpp, setApplyingOpp] = useState(null);
  const [applyNote, setApplyNote] = useState('');
  const [applyPortfolio, setApplyPortfolio] = useState('');
  const [submittingApply, setSubmittingApply] = useState(false);

  // View Applicants Drawer
  const [viewingApplicantsOpp, setViewingApplicantsOpp] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);

  const loadOpportunities = async () => {
    setLoading(true);
    try {
      const list = await api.getOpportunities(selectedType);
      setOpportunities(list);
    } catch (err) {
      console.error('Failed to load opportunities', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOpportunities();
  }, [selectedType]);

  const handleCreateOpportunity = async (e) => {
    e.preventDefault();
    if (!newOpp.title.trim()) return;
    try {
      const skillsArray = newOpp.required_skills
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      await api.createOpportunity({
        ...newOpp,
        required_skills: skillsArray,
        organization: newOpp.organization || user?.organization || user?.name
      });
      setShowCreateModal(false);
      setNewOpp({
        title: '',
        organization: '',
        type: 'hackathon',
        description: '',
        required_skills: '',
        stipend_prize: '',
        deadline: '',
        location: 'Campus / Remote'
      });
      loadOpportunities();
    } catch (err) {
      alert('Failed to publish opportunity: ' + err.message);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!applyingOpp) return;
    setSubmittingApply(true);
    try {
      await api.applyOpportunity(applyingOpp.id, {
        opportunity_id: applyingOpp.id,
        note: applyNote,
        portfolio_link: applyPortfolio || null
      });
      alert('Application submitted successfully!');
      setApplyingOpp(null);
      setApplyNote('');
      setApplyPortfolio('');
      loadOpportunities();
    } catch (err) {
      alert('Application failed: ' + err.message);
    } finally {
      setSubmittingApply(false);
    }
  };

  const handleViewApplicants = async (opp) => {
    setViewingApplicantsOpp(opp);
    setLoadingApplicants(true);
    try {
      const data = await api.getApplications(opp.id);
      setApplicants(data);
    } catch (err) {
      console.error('Failed to load applicants', err);
    } finally {
      setLoadingApplicants(false);
    }
  };

  const typeStyles = {
    hackathon: 'bg-purple-100 text-purple-800 border-purple-200',
    internship: 'bg-blue-100 text-blue-800 border-blue-200',
    project: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    competition: 'bg-amber-100 text-amber-800 border-amber-200',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-8 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold backdrop-blur-xs">
            <Trophy className="w-4 h-4 text-amber-300" />
            <span>Opportunities & Hackathon Marketplace</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Campus Opportunities & Team Openings</h1>
          <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
            Apply to university hackathons, industry research internships, and student innovation teams based on your verified skill profile.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-md transition flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Post Opportunity / Team Need</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 pb-2">
        {[
          { id: '', label: 'All Opportunities' },
          { id: 'hackathon', label: 'Hackathons' },
          { id: 'internship', label: 'Internships' },
          { id: 'project', label: 'Student Projects' },
          { id: 'competition', label: 'Competitions' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setSelectedType(t.id)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
              selectedType === t.id
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Opportunities List Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 text-xs sm:text-sm">
          Loading campus opportunities...
        </div>
      ) : opportunities.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center text-slate-500">
          No opportunities found in this category. Be the first to post one!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {opportunities.map((opp) => (
            <div
              key={opp.id}
              className="bg-white rounded-3xl border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition p-6 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${typeStyles[opp.type] || 'bg-slate-100 text-slate-700'}`}>
                    {opp.type}
                  </span>
                  <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    <span>{opp.applications_count || 0} applied</span>
                  </span>
                </div>

                <div>
                  <h3 className="font-extrabold text-base sm:text-lg text-slate-900 leading-snug">
                    {opp.title}
                  </h3>
                  <p className="text-xs font-semibold text-indigo-600 mt-0.5">
                    {opp.organization}
                  </p>
                </div>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {opp.description}
                </p>

                {/* Prize / Stipend */}
                {opp.stipend_prize && (
                  <div className="bg-amber-50 rounded-xl p-2.5 border border-amber-100 flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-amber-600 shrink-0" />
                    <span className="text-xs font-bold text-amber-900">{opp.stipend_prize}</span>
                  </div>
                )}

                {/* Required Skills */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Required Skills:</span>
                  <div className="flex flex-wrap gap-1">
                    {(opp.required_skills || []).map((sk, i) => (
                      <span key={i} className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Meta Row */}
                <div className="pt-2 border-t border-slate-100 text-xs text-slate-500 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{opp.location || 'Remote'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Deadline: {opp.deadline || 'Open'}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                {opp.posted_by_id === user?.id ? (
                  <button
                    onClick={() => handleViewApplicants(opp)}
                    className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition flex items-center justify-center gap-1.5"
                  >
                    <span>View Applicants ({opp.applications_count || 0})</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setApplyingOpp(opp)}
                    className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition flex items-center justify-center gap-1.5"
                  >
                    <span>Apply with Skill Profile</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Apply Modal */}
      {applyingOpp && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Apply to {applyingOpp.title}</h3>
            <p className="text-xs text-slate-500">
              Your profile, skills, and verified certificates will be presented to <span className="font-semibold text-slate-800">{applyingOpp.organization}</span>.
            </p>

            <form onSubmit={handleApply} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Why are you a great fit? (Motivation & relevant experience)
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Explain which of the required skills you excel in, and any relevant projects..."
                  value={applyNote}
                  onChange={(e) => setApplyNote(e.target.value)}
                  className="w-full text-xs sm:text-sm p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Specific Project / GitHub / Portfolio Link (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://github.com/your-repo"
                  value={applyPortfolio}
                  onChange={(e) => setApplyPortfolio(e.target.value)}
                  className="w-full text-xs sm:text-sm p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setApplyingOpp(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingApply}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Post Opportunity Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Post Campus Opportunity or Team Need</h3>
            <form onSubmit={handleCreateOpportunity} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AI Hackathon Squad: Looking for Frontend + UI Designer"
                  value={newOpp.title}
                  onChange={(e) => setNewOpp(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full text-xs sm:text-sm p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Organization / Host</label>
                  <input
                    type="text"
                    placeholder="e.g. Nexus Tech / GDSC Campus"
                    value={newOpp.organization}
                    onChange={(e) => setNewOpp(prev => ({ ...prev, organization: e.target.value }))}
                    className="w-full text-xs sm:text-sm p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category Type</label>
                  <select
                    value={newOpp.type}
                    onChange={(e) => setNewOpp(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full text-xs sm:text-sm p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                  >
                    <option value="hackathon">Hackathon</option>
                    <option value="internship">Internship</option>
                    <option value="project">Student Project</option>
                    <option value="competition">Competition</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description & Scope</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detail the project goals, responsibilities, and timeline..."
                  value={newOpp.description}
                  onChange={(e) => setNewOpp(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full text-xs sm:text-sm p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Required Skills (comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g. React, Kotlin, Python, Figma"
                  value={newOpp.required_skills}
                  onChange={(e) => setNewOpp(prev => ({ ...prev, required_skills: e.target.value }))}
                  className="w-full text-xs sm:text-sm p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Prize / Stipend</label>
                  <input
                    type="text"
                    placeholder="e.g. $2,000 Cash Prize or Paid Internship"
                    value={newOpp.stipend_prize}
                    onChange={(e) => setNewOpp(prev => ({ ...prev, stipend_prize: e.target.value }))}
                    className="w-full text-xs sm:text-sm p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Deadline Date</label>
                  <input
                    type="date"
                    value={newOpp.deadline}
                    onChange={(e) => setNewOpp(prev => ({ ...prev, deadline: e.target.value }))}
                    className="w-full text-xs sm:text-sm p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  Publish Opportunity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Applicants Modal */}
      {viewingApplicantsOpp && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Applicants for {viewingApplicantsOpp.title}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {applicants.length} student talent(s) applied
                  </p>
                </div>
                <button
                  onClick={() => setViewingApplicantsOpp(null)}
                  className="text-xs font-semibold text-slate-400 hover:text-slate-600"
                >
                  Close
                </button>
              </div>

              <div className="overflow-y-auto max-h-[50vh] py-3 space-y-3">
                {loadingApplicants ? (
                  <p className="text-center text-xs text-slate-400 py-6">Loading applications...</p>
                ) : applicants.length === 0 ? (
                  <p className="text-center text-xs text-slate-400 py-6">No applications received yet.</p>
                ) : (
                  applicants.map((app) => (
                    <div key={app.id} className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-bold text-sm text-slate-900">{app.student_name}</span>
                          <span className="text-xs text-slate-500 ml-2">({app.student_department})</span>
                        </div>
                        <span className="text-[10px] text-slate-400">{app.applied_at}</span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed italic">
                        "{app.note}"
                      </p>
                      {app.portfolio_link && (
                        <a
                          href={app.portfolio_link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-semibold text-indigo-600 hover:underline inline-flex items-center gap-1"
                        >
                          <span>Review Applicant Portfolio Link</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setViewingApplicantsOpp(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
