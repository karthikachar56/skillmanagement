import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { 
  X, 
  Send, 
  Users, 
  CheckCircle2
} from 'lucide-react';

export default function CollabModal({ targetStudent, onClose, onSuccess }) {
  const [projectTitle, setProjectTitle] = useState('Smart Campus Team Project');
  const [roleNeeded, setRoleNeeded] = useState('Lead Collaborator');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  // Initialize form defaults when targetStudent changes
  useEffect(() => {
    if (targetStudent) {
      const defaultRole = targetStudent.skills?.[0]?.name 
        ? `${targetStudent.skills[0].name} Specialist`
        : 'Lead Collaborator';
      setRoleNeeded(defaultRole);
      setProjectTitle('Campus Team Project');
      setMessage(
        `Hi ${targetStudent.name}! I saw your skills on SkillBridge and would love to collaborate on a project with you.`
      );
      setSending(false);
      setSentSuccess(false);
    }
  }, [targetStudent]);

  if (!targetStudent) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!projectTitle.trim() || !message.trim()) return;
    setSending(true);
    try {
      await api.sendCollaboration({
        receiver_id: targetStudent.id,
        project_title: projectTitle,
        role_needed: roleNeeded,
        message: message,
      });
      
      setSentSuccess(true);
      if (onSuccess) onSuccess();
      setTimeout(() => {
        onClose();
        setSentSuccess(false);
      }, 1600);
    } catch (err) {
      alert('Failed to send request: ' + err.message);
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-5 relative animate-in zoom-in-95 duration-200">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Target Student Header */}
        <div className="flex items-center gap-3.5 pb-2 border-b border-slate-100">
          <img
            src={targetStudent.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${targetStudent.name}`}
            alt={targetStudent.name}
            className="w-12 h-12 rounded-2xl object-cover ring-2 ring-indigo-200 bg-white shrink-0 shadow-2xs"
          />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-slate-900">
                {targetStudent.name}
              </h3>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Open for Collabs
              </span>
            </div>
            <p className="text-xs text-slate-500">{targetStudent.department}</p>
          </div>
        </div>

        {sentSuccess ? (
          <div className="py-6 text-center space-y-3 animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-xs">
              <CheckCircle2 className="w-8 h-8 animate-bounce" />
            </div>
            <h4 className="text-lg font-extrabold text-slate-900">
              Collaboration Request Sent!
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Your invitation has been delivered to <span className="font-bold text-slate-800">{targetStudent.name}</span>. They can accept or reject it in their Dashboard.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5 pt-1">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Project Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Smart Campus AI Assistant"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                className="w-full text-xs sm:text-sm p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Role You Need Them For
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Lead UI/UX Designer, Python Backend, ML Specialist"
                value={roleNeeded}
                onChange={(e) => setRoleNeeded(e.target.value)}
                className="w-full text-xs sm:text-sm p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Invitation Pitch / Message
              </label>
              <textarea
                rows={3}
                required
                placeholder="Explain what you plan to build together and why their skills are a perfect fit..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full text-xs sm:text-sm p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <p className="text-[11px] text-slate-400">
              When sent, {targetStudent.name} will receive this request in their Dashboard Menu with an option to Accept or Reject.
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={sending}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition flex items-center gap-1.5 disabled:opacity-50"
              >
                {sending ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Request</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
