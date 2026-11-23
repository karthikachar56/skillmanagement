import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import { 
  ShieldCheck, 
  Users, 
  UserPlus, 
  Lock, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw 
} from 'lucide-react';

export default function AdminPanel() {
  const { user } = useAuth();
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const list = await api.getAllUsers();
      setUsersList(list);
    } catch (err) {
      console.error('Failed to load users', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleChangeRole = async (userId, newRole) => {
    try {
      await api.updateUserRole(userId, newRole);
      loadUsers();
    } catch (err) {
      alert('Failed to update role: ' + err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-8 shadow-lg flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold backdrop-blur-xs text-rose-300">
            <ShieldCheck className="w-4 h-4 text-rose-400" />
            <span>Administrative Control Center</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight mt-2">Platform & Role Management</h1>
          <p className="text-slate-300 text-sm max-w-xl mt-1">
            Supervise user accounts, assign faculty reviewer permissions, and oversee platform integrity.
          </p>
        </div>

        <button
          onClick={loadUsers}
          className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition flex items-center gap-2 text-xs font-bold"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            All Registered Platform Accounts ({usersList.length})
          </h2>
          <span className="text-xs text-slate-400">Manage permissions</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-6">User / Name</th>
                <th className="py-3.5 px-6">Email</th>
                <th className="py-3.5 px-6">Department / Org</th>
                <th className="py-3.5 px-6">Current Role</th>
                <th className="py-3.5 px-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {usersList.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3.5 px-6 flex items-center gap-3">
                    <img
                      src={u.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${u.name}`}
                      alt={u.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="font-bold text-slate-900">{u.name}</span>
                  </td>
                  <td className="py-3.5 px-6 font-mono text-slate-500 text-xs">{u.email}</td>
                  <td className="py-3.5 px-6 text-slate-600">{u.department || u.organization || '—'}</td>
                  <td className="py-3.5 px-6">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                      u.role === 'admin' ? 'bg-rose-100 text-rose-800' :
                      u.role === 'faculty' ? 'bg-indigo-100 text-indigo-800' :
                      u.role === 'recruiter' ? 'bg-amber-100 text-amber-800' :
                      'bg-emerald-100 text-emerald-800'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-6">
                    <select
                      value={u.role}
                      onChange={(e) => handleChangeRole(u.id, e.target.value)}
                      className="text-xs bg-slate-100 border border-slate-300 rounded-lg px-2.5 py-1 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="student">Student</option>
                      <option value="faculty">Faculty / Mentor</option>
                      <option value="recruiter">Recruiter</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
