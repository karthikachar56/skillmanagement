import React, { useState } from 'react';
import { api } from '../api';
import { X, Award, ShieldCheck } from 'lucide-react';

export default function UploadCertModal({ isOpen, onClose, onSuccess }) {
  const [title, setTitle] = useState('');
  const [issuer, setIssuer] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [credentialUrl, setCredentialUrl] = useState('');
  const [certType, setCertType] = useState('Course');
  const [skillsCovered, setSkillsCovered] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !issuer.trim()) return;
    setSubmitting(true);
    try {
      const skillsArray = skillsCovered
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      await api.uploadCertificate({
        title,
        issuer,
        issue_date: issueDate || new Date().toISOString().slice(0, 10),
        credential_url: credentialUrl || null,
        certificate_type: certType,
        skills_covered: skillsArray
      });

      alert('Certificate submitted! It has been added to the Faculty Verification Queue for audit.');
      onClose();
      if (onSuccess) onSuccess();
    } catch (err) {
      alert('Upload failed: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Upload Certificate Proof</h3>
            <p className="text-xs text-slate-500">Submitted credentials are reviewed by campus faculty mentors.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 pt-1">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Certificate / Achievement Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. AWS Certified Solutions Architect or Smart India Hackathon Finalist"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-xs sm:text-sm p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Issuing Organization
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Amazon, Google, Stanford, HackIndia"
                value={issuer}
                onChange={(e) => setIssuer(e.target.value)}
                className="w-full text-xs sm:text-sm p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Certificate Type
              </label>
              <select
                value={certType}
                onChange={(e) => setCertType(e.target.value)}
                className="w-full text-xs sm:text-sm p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
              >
                <option value="Course">Online Course</option>
                <option value="Professional">Professional Certification</option>
                <option value="Hackathon">Hackathon Achievement</option>
                <option value="Internship">Internship Completion</option>
                <option value="Workshop">Technical Workshop</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Date Issued
              </label>
              <input
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="w-full text-xs sm:text-sm p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Public Verification Link
              </label>
              <input
                type="url"
                placeholder="https://..."
                value={credentialUrl}
                onChange={(e) => setCredentialUrl(e.target.value)}
                className="w-full text-xs sm:text-sm p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Skills Validated by Certificate (comma-separated)
            </label>
            <input
              type="text"
              placeholder="e.g. Python, Docker, PyTorch (auto-verifies on profile upon faculty approval)"
              value={skillsCovered}
              onChange={(e) => setSkillsCovered(e.target.value)}
              className="w-full text-xs sm:text-sm p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md transition flex items-center gap-1.5 disabled:opacity-50"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{submitting ? 'Submitting...' : 'Submit for Faculty Audit'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
