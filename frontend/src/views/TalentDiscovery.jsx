import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { 
  Search, 
  Filter, 
  Sparkles, 
  Award, 
  FolderGit2, 
  CheckCircle2, 
  MessageSquare, 
  ChevronRight, 
  SlidersHorizontal,
  ExternalLink,
  ShieldCheck,
  Zap,
  Check
} from 'lucide-react';
import { WhatsAppIcon, openWhatsApp } from '../components/BrandIcons';

const COMMON_SKILLS = [
  'Python', 'FastAPI', 'React', 'Figma', 'UI/UX Design', 
  'Kotlin', 'Flutter', 'PyTorch', 'Scikit-learn', 'Docker', 
  'C++', 'IoT', 'MongoDB', 'System Design'
];

const DEPARTMENTS = [
  'All Departments',
  'Computer Science & Engineering',
  'Information Science & Engineering',
  'Artificial Intelligence & Data Science',
  'Electronics & Communication Engineering'
];

export default function TalentDiscovery({ onSelectStudent, onOpenCollab }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedProficiency, setSelectedProficiency] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');
  const [availableOnly, setAvailableOnly] = useState(false);
  const [minCredibility, setMinCredibility] = useState(0);

  const fetchTalents = async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchTerm) params.q = searchTerm;
      if (selectedSkills.length > 0) params.skills = selectedSkills.join(',');
      if (selectedProficiency) params.proficiency = selectedProficiency;
      if (selectedDepartment && selectedDepartment !== 'All Departments') params.department = selectedDepartment;
      if (availableOnly) params.available_only = true;
      if (minCredibility > 0) params.min_credibility = minCredibility;

      const data = await api.searchTalents(params);
      setStudents(data);
    } catch (err) {
      console.error('Failed to load talents', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchTalents();
    }, 250);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, selectedSkills, selectedProficiency, selectedDepartment, availableOnly, minCredibility]);

  const toggleSkill = (skill) => {
    setSelectedSkills(prev => 
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedSkills([]);
    setSelectedProficiency('');
    setSelectedDepartment('All Departments');
    setAvailableOnly(false);
    setMinCredibility(0);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero Search Section */}
      <div className="relative rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 text-white p-8 md:p-12 shadow-xl overflow-hidden">
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none"></div>
        <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-sky-500/20 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-xs font-semibold text-indigo-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Campus Skill Discovery Engine</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Find the right talent for your projects & hackathons.
          </h1>
          <p className="text-indigo-100 text-base sm:text-lg">
            Connect with verified student programmers, designers, ML researchers, and makers across all university departments.
          </p>

          {/* Search Bar Input */}
          <div className="pt-2">
            <div className="relative flex items-center">
              <Search className="w-5 h-5 absolute left-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by student name, skill (e.g. Python, Figma), project, or keywords..."
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white text-slate-900 placeholder:text-slate-400 text-sm sm:text-base font-medium shadow-lg focus:outline-none focus:ring-4 focus:ring-indigo-400/50"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 text-xs font-semibold text-slate-400 hover:text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
            <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
            <span>Filter Talent Pool</span>
            <span className="ml-2 text-xs font-normal text-slate-500">
              ({students.length} students matched)
            </span>
          </div>
          {(selectedSkills.length > 0 || selectedProficiency || selectedDepartment !== 'All Departments' || availableOnly || minCredibility > 0 || searchTerm) && (
            <button
              onClick={resetFilters}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline"
            >
              Reset all filters
            </button>
          )}
        </div>

        {/* Skill Pills */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
            Filter by In-Demand Skills:
          </label>
          <div className="flex flex-wrap gap-1.5">
            {COMMON_SKILLS.map((sk) => {
              const active = selectedSkills.includes(sk);
              return (
                <button
                  key={sk}
                  onClick={() => toggleSkill(sk)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                    active
                      ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {active && <Check className="w-3 h-3 text-white" />}
                  <span>{sk}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selectors Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          {/* Department */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
              Department
            </label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          {/* Proficiency */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
              Minimum Proficiency
            </label>
            <select
              value={selectedProficiency}
              onChange={(e) => setSelectedProficiency(e.target.value)}
              className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Any Proficiency Level</option>
              <option value="beginner">Beginner+</option>
              <option value="intermediate">Intermediate+</option>
              <option value="advanced">Advanced Only</option>
            </select>
          </div>

          {/* Min Credibility Score */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Min Credibility Score
              </label>
              <span className="text-xs font-bold text-indigo-600">{minCredibility}+</span>
            </div>
            <input
              type="range"
              min="0"
              max="90"
              step="10"
              value={minCredibility}
              onChange={(e) => setMinCredibility(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>

          {/* Availability Toggle */}
          <div className="flex items-center sm:pt-6">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={availableOnly}
                onChange={(e) => setAvailableOnly(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-xs sm:text-sm font-medium text-slate-700">
                Available for Collabs Only
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Results Grid */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="inline-block w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-3 text-sm font-medium text-slate-500">Searching student talent index...</p>
        </div>
      ) : students.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No student talents matched your criteria</h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            Try adjusting your skill filters, clearing the search query, or lowering the minimum credibility score.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map((student) => {
            const cred = student.credibility || { score: 50, badge: 'Talent' };
            const isAvailable = student.available_for_collaboration;

            return (
              <div
                key={student.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all duration-200 flex flex-col justify-between overflow-hidden group"
              >
                <div className="p-5 space-y-4">
                  {/* Card Header */}
                  <div className="flex items-start gap-3.5">
                    <img
                      src={student.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${student.name}`}
                      alt={student.name}
                      className="w-14 h-14 rounded-2xl object-cover ring-2 ring-slate-100 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <h3 
                          onClick={() => onSelectStudent(student.id)}
                          className="font-bold text-base text-slate-900 truncate hover:text-indigo-600 cursor-pointer"
                        >
                          {student.name}
                        </h3>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {student.whatsapp && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                openWhatsApp(student.whatsapp, student.name);
                              }}
                              className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-2xs transition"
                              title="Chat directly on WhatsApp"
                            >
                              <WhatsAppIcon className="w-3 h-3" />
                              <span>WhatsApp</span>
                            </button>
                          )}
                          {isAvailable ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                              Available
                            </span>
                          ) : (
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 shrink-0">
                              Busy
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 truncate">{student.department}</p>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                        <span>Sem {student.semester || 4}</span>
                        <span>•</span>
                        <span className="font-mono">{student.srn || 'SRN'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Credibility Score Meter */}
                  <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-700">
                        <Zap className="w-3 h-3 text-amber-500" />
                        <span>Credibility Score</span>
                      </div>
                      <span className="text-[10px] font-medium text-slate-500">{cred.badge}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 rounded-full bg-slate-200 overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-indigo-500 to-sky-400 rounded-full"
                          style={{ width: `${cred.score}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-extrabold text-indigo-700">{cred.score}/100</span>
                    </div>
                  </div>

                  {/* Bio snippet */}
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {student.bio || 'Passionate student collaborator.'}
                  </p>

                  {/* Skills Section */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Top Skills:</span>
                    <div className="flex flex-wrap gap-1">
                      {(student.skills || []).slice(0, 5).map((sk, idx) => {
                        const isMatched = (student.matched_skills || []).includes(sk.name);
                        return (
                          <span
                            key={idx}
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium ${
                              isMatched 
                                ? 'bg-indigo-600 text-white font-semibold'
                                : sk.verified
                                ? 'bg-sky-50 text-sky-800 border border-sky-200'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            <span>{sk.name}</span>
                            {sk.verified && <CheckCircle2 className={`w-3 h-3 ${isMatched ? 'text-indigo-200' : 'text-sky-600'}`} />}
                          </span>
                        );
                      })}
                      {(student.skills || []).length > 5 && (
                        <span className="text-[10px] font-semibold text-slate-400 px-1 py-0.5">
                          +{(student.skills || []).length - 5} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Proofs Summary */}
                  <div className="flex items-center gap-3 pt-1 text-xs text-slate-500 border-t border-slate-100">
                    <div className="flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-amber-500" />
                      <span>{student.verified_certs_count || 0} Verified Certs</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FolderGit2 className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{(student.projects || []).length} Projects</span>
                    </div>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="bg-slate-50 px-5 py-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onSelectStudent(student.id)}
                    className="text-xs font-semibold text-slate-600 hover:text-indigo-600 flex items-center gap-1 transition"
                  >
                    <span>View Profile</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-2">
                    {student.whatsapp && (
                      <button
                        type="button"
                        onClick={() => openWhatsApp(student.whatsapp, student.name)}
                        className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition"
                        title="Chat on WhatsApp"
                      >
                        <WhatsAppIcon className="w-4 h-4 text-emerald-600" />
                      </button>
                    )}
                    <button
                      onClick={() => onOpenCollab(student)}
                      className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Collaborate</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
