import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import { 
  X, 
  Award, 
  FolderGit2, 
  ExternalLink, 
  Globe, 
  CheckCircle2, 
  ThumbsUp, 
  MessageSquare, 
  Zap,
  Phone
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './BrandIcons';

export default function StudentModal({ studentId, onClose, onOpenCollab }) {
  const { user } = useAuth();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [endorsing, setEndorsing] = useState(null);

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const data = await api.getStudentProfile(studentId);
      setStudent(data);
    } catch (err) {
      console.error('Failed to load student details', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (studentId) {
      fetchDetails();
    }
  }, [studentId]);

  const handleEndorse = async (skillName) => {
    setEndorsing(skillName);
    try {
      await api.endorseSkill(studentId, skillName);
      fetchDetails();
    } catch (err) {
      alert('Endorsement failed: ' + err.message);
    } finally {
      setEndorsing(null);
    }
  };

  if (!studentId) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto space-y-6 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {loading ? (
          <div className="py-20 text-center text-slate-400 text-xs">Loading profile details...</div>
        ) : !student ? (
          <div className="py-20 text-center text-slate-400 text-xs">Profile not found.</div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-start gap-4 pr-8">
              <img
                src={student.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${student.name}`}
                alt={student.name}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-slate-100 shrink-0"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-slate-900">{student.name}</h2>
                  {student.available_for_collaboration && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Open for Teams
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500">{student.department}</p>
                <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                  <span>Semester {student.semester || 4}</span>
                  <span>•</span>
                  <span className="font-mono">{student.srn}</span>
                </div>
              </div>
            </div>

            {/* Credibility Score Banner */}
            <div className="bg-indigo-50/60 rounded-2xl p-3.5 border border-indigo-100 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span>Credibility Indicator: {student.credibility?.badge}</span>
                </div>
                <p className="text-[11px] text-indigo-700 mt-0.5">
                  Verified achievements, projects, and mentor ratings.
                </p>
              </div>
              <span className="text-xl font-black text-indigo-700">
                {student.credibility?.score}/100
              </span>
            </div>

            {/* Contact Info (if available) */}
            {student.phone && (
              <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200/80 flex items-center justify-between text-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>Contact Number</span>
                </span>
                <span className="font-mono font-semibold text-slate-800">{student.phone}</span>
              </div>
            )}

            {/* Bio */}
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Bio</span>
              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                {student.bio || 'Passionate student engineer.'}
              </p>
            </div>

            {/* Skills & Endorsement */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Skills & Faculty Endorsements
                </span>
                <span className="text-[10px] text-slate-400">Click thumbs up to endorse!</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(student.skills || []).map((sk, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-800">{sk.name}</span>
                        {sk.verified && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" title="Verified by Certificate" />
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 capitalize">{sk.proficiency}</span>
                    </div>

                    <button
                      onClick={() => handleEndorse(sk.name)}
                      disabled={endorsing === sk.name}
                      className="px-2 py-1 rounded-lg bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 text-xs font-semibold flex items-center gap-1 border border-slate-200 transition"
                      title="Endorse this skill"
                    >
                      <ThumbsUp className="w-3 h-3" />
                      <span>{sk.endorsements || 0}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Projects Showcase */}
            {(student.projects || []).length > 0 && (
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Portfolio Highlights
                </span>
                <div className="space-y-2">
                  {student.projects.map((proj) => (
                    <div key={proj.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-900">{proj.title}</h4>
                        {proj.live_url && (
                          <a href={proj.live_url} target="_blank" rel="noreferrer" className="text-indigo-600 text-[11px] hover:underline flex items-center gap-0.5">
                            <span>Live</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-600">{proj.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Footer */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onClose();
                  onOpenCollab(student);
                }}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition flex items-center gap-1.5"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Invite to Collaborate</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
