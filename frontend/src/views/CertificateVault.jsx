import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import { 
  Award, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  ExternalLink, 
  Plus, 
  ShieldCheck, 
  UserCheck, 
  Filter,
  Check,
  X,
  Sparkles
} from 'lucide-react';

export default function CertificateVault({ onOpenUpload }) {
  const { user } = useAuth();
  const [certs, setCerts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  // Review modal
  const [reviewingCert, setReviewingCert] = useState(null);
  const [reviewStatus, setReviewStatus] = useState('verified');
  const [reviewNotes, setReviewNotes] = useState('');

  const isFacultyOrAdmin = user?.role === 'faculty' || user?.role === 'admin';

  const loadData = async () => {
    setLoading(true);
    try {
      const [queueData, statsData] = await Promise.all([
        api.getVerificationQueue(),
        api.getCertStats()
      ]);
      setCerts(queueData);
      setStats(statsData);
    } catch (err) {
      console.error('Failed to load certificates', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleOpenReview = (cert, status) => {
    setReviewingCert(cert);
    setReviewStatus(status);
    setReviewNotes(
      status === 'verified'
        ? `Official credential checked and approved by ${user.name}`
        : 'Certificate could not be verified. Please re-upload with clear public credential link.'
    );
  };

  const handleConfirmReview = async (e) => {
    e.preventDefault();
    if (!reviewingCert) return;
    try {
      await api.reviewCertificate(reviewingCert.id, {
        status: reviewStatus,
        reviewer_notes: reviewNotes
      });
      setReviewingCert(null);
      loadData();
    } catch (err) {
      alert('Review action failed: ' + err.message);
    }
  };

  const filteredCerts = certs.filter(c => {
    if (filter === 'all') return true;
    return c.status === filter;
  });

  const pendingCerts = certs.filter(c => c.status === 'pending');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white p-8 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-xs">
            <ShieldCheck className="w-4 h-4 text-amber-200" />
            <span>Official Campus Credential Registry</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Certificate Vault & Verification Engine</h1>
          <p className="text-amber-100 text-sm leading-relaxed">
            Eliminate unverified skill claims. Students submit certificates; authorized faculty mentors audit and approve credentials to boost the student's authentic Credibility Score.
          </p>
        </div>

        <button
          onClick={onOpenUpload}
          className="px-5 py-3 rounded-2xl bg-white text-amber-900 font-bold text-sm shadow-md hover:bg-amber-50 hover:scale-105 transition flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4 text-amber-600" />
          <span>Upload Certificate Proof</span>
        </button>
      </div>

      {/* Metrics Row */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Submissions</span>
            <div className="text-2xl font-black text-slate-900 mt-1">{stats.total}</div>
            <span className="text-xs text-slate-400">Campus-wide archive</span>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-emerald-100 bg-emerald-50/20 shadow-xs">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Verified Badges
            </span>
            <div className="text-2xl font-black text-emerald-800 mt-1">{stats.verified}</div>
            <span className="text-xs text-emerald-600 font-medium">Faculty approved</span>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-amber-100 bg-amber-50/20 shadow-xs">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Pending Queue
            </span>
            <div className="text-2xl font-black text-amber-800 mt-1">{stats.pending}</div>
            <span className="text-xs text-amber-600 font-medium">Awaiting audit</span>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Verification Rate</span>
            <div className="text-2xl font-black text-indigo-700 mt-1">{stats.verification_rate}%</div>
            <span className="text-xs text-slate-400">Verified authenticity</span>
          </div>
        </div>
      )}

      {/* Faculty Verification Queue Section (Prominent if Faculty / Admin or to demonstrate verification) */}
      <div className="bg-white rounded-3xl border-2 border-indigo-200 p-6 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-indigo-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Faculty Verification Queue
              </h2>
              <p className="text-xs text-slate-500">
                {isFacultyOrAdmin
                  ? `Reviewing as authorized mentor: ${user?.name}`
                  : 'Demonstration queue: see how mentors review and verify student credentials'}
              </p>
            </div>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-800 self-start sm:self-auto">
            {pendingCerts.length} Pending Actions
          </span>
        </div>

        {pendingCerts.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs sm:text-sm">
            ✨ All student certificates have been audited! No pending reviews in the queue.
          </div>
        ) : (
          <div className="space-y-3">
            {pendingCerts.map((cert) => (
              <div
                key={cert.id}
                className="p-4 rounded-2xl border border-amber-200 bg-amber-50/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase font-bold px-2 py-0.5 rounded bg-amber-200 text-amber-900">
                      {cert.certificate_type || 'Certificate'}
                    </span>
                    <h3 className="font-bold text-sm sm:text-base text-slate-900">{cert.title}</h3>
                  </div>

                  <div className="text-xs text-slate-600 flex flex-wrap items-center gap-2 font-medium">
                    <span className="font-bold text-slate-800">{cert.student_name}</span>
                    <span>•</span>
                    <span className="font-mono">{cert.student_srn || 'SRN'}</span>
                    <span>•</span>
                    <span>Issuer: {cert.issuer}</span>
                    <span>•</span>
                    <span>Date: {cert.issue_date}</span>
                  </div>

                  {/* Skills covered */}
                  {(cert.skills_covered || []).length > 0 && (
                    <div className="flex items-center gap-1.5 pt-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Validates:</span>
                      {cert.skills_covered.map((s, idx) => (
                        <span key={idx} className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white text-indigo-700 border border-indigo-200">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}

                  {cert.credential_url && (
                    <a
                      href={cert.credential_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline pt-1"
                    >
                      <span>Check Credential Verification URL</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                {/* Faculty Decision Buttons */}
                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  <button
                    onClick={() => handleOpenReview(cert, 'verified')}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 shadow-xs transition"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Approve & Verify</span>
                  </button>
                  <button
                    onClick={() => handleOpenReview(cert, 'rejected')}
                    className="px-3 py-1.5 rounded-xl bg-white border border-rose-300 hover:bg-rose-50 text-rose-700 text-xs font-semibold flex items-center gap-1 transition"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Complete Certificate Directory */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900">All Registered Credentials</h2>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-medium">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-lg transition ${filter === 'all' ? 'bg-white shadow-xs font-bold text-slate-800' : 'text-slate-600'}`}
            >
              All ({certs.length})
            </button>
            <button
              onClick={() => setFilter('verified')}
              className={`px-3 py-1 rounded-lg transition ${filter === 'verified' ? 'bg-white shadow-xs font-bold text-emerald-700' : 'text-slate-600'}`}
            >
              Verified
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-3 py-1 rounded-lg transition ${filter === 'pending' ? 'bg-white shadow-xs font-bold text-amber-700' : 'text-slate-600'}`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter('rejected')}
              className={`px-3 py-1 rounded-lg transition ${filter === 'rejected' ? 'bg-white shadow-xs font-bold text-rose-700' : 'text-slate-600'}`}
            >
              Rejected
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCerts.map((c) => {
            const isVerified = c.status === 'verified';
            const isPending = c.status === 'pending';

            return (
              <div
                key={c.id}
                className="p-4 rounded-2xl border border-slate-200 bg-white hover:shadow-xs transition space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      {c.certificate_type || 'Proof'}
                    </span>
                    {isVerified && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" /> Verified
                      </span>
                    )}
                    {isPending && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                        <Clock className="w-3 h-3" /> Pending Review
                      </span>
                    )}
                    {c.status === 'rejected' && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                        <XCircle className="w-3 h-3" /> Rejected
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-snug">{c.title}</h3>
                  <div className="text-xs text-slate-500">
                    <span className="font-medium text-slate-700">{c.student_name}</span> • {c.issuer}
                  </div>

                  {c.reviewer_notes && (
                    <div className="bg-slate-50 p-2.5 rounded-xl text-[11px] text-slate-600 border border-slate-100">
                      <p className="italic">"{c.reviewer_notes}"</p>
                      <span className="block text-[10px] font-bold text-slate-700 mt-1">— {c.reviewed_by}</span>
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400">{c.issue_date}</span>
                  {c.credential_url && (
                    <a
                      href={c.credential_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-indigo-600 hover:underline font-semibold flex items-center gap-1"
                    >
                      <span>Public Link</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Review Confirmation Modal */}
      {reviewingCert && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">
              {reviewStatus === 'verified' ? 'Approve & Verify Certificate' : 'Reject Certificate'}
            </h3>
            <p className="text-xs text-slate-600">
              Student: <span className="font-bold text-slate-900">{reviewingCert.student_name}</span> ({reviewingCert.title})
            </p>

            <form onSubmit={handleConfirmReview} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Faculty Review Notes
                </label>
                <textarea
                  rows={3}
                  required
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  className="w-full text-xs sm:text-sm p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReviewingCert(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 rounded-xl text-xs font-semibold text-white ${
                    reviewStatus === 'verified' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
                  }`}
                >
                  Confirm {reviewStatus === 'verified' ? 'Approval' : 'Rejection'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
