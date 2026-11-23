import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Award, 
  Database, 
  ShieldCheck, 
  Layers, 
  GraduationCap 
} from 'lucide-react';

export default function CampusAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.getAnalyticsOverview();
        setData(res);
      } catch (err) {
        console.error('Failed to load analytics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="inline-block w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-3 text-sm font-medium text-slate-500">Loading campus skill analytics...</p>
      </div>
    );
  }

  const metrics = data?.metrics || {};
  const topSkills = data?.top_trending_skills || [];
  const deptDist = data?.department_distribution || [];
  const maxSkillCount = Math.max(...topSkills.map(s => s.count), 1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-8 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold backdrop-blur-xs text-sky-300">
            <BarChart3 className="w-4 h-4 text-sky-400" />
            <span>Campus Intelligence & Growth Insights</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">University Skill Analytics</h1>
          <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
            Real-time visibility into technical talents, credential verification rates, emerging campus technologies, and cross-department collaboration metrics.
          </p>
        </div>

        {/* Database Engine Status Pill */}
        <div className="bg-white/10 border border-white/15 rounded-2xl p-4 shrink-0 flex items-center gap-3">
          <Database className="w-8 h-8 text-emerald-400" />
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-300 block">Database Engine</span>
            <span className="text-sm font-bold text-white">
              {data?.db_status?.engine || 'MongoDB Store'}
            </span>
            <span className="text-[10px] text-emerald-300 block">● Active & Synced</span>
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-indigo-600" /> Registered Talents
          </span>
          <div className="text-3xl font-black text-slate-900 mt-1">{metrics.total_students}</div>
          <span className="text-xs text-slate-400">Student profiles</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-amber-500" /> Verified Credentials
          </span>
          <div className="text-3xl font-black text-emerald-700 mt-1">{metrics.total_verified_certificates}</div>
          <span className="text-xs text-slate-400">{metrics.pending_verifications} pending reviews</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-sky-600" /> Active Squads
          </span>
          <div className="text-3xl font-black text-sky-700 mt-1">{metrics.active_collaborations}</div>
          <span className="text-xs text-slate-400">P2P team projects</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <GraduationCap className="w-3.5 h-3.5 text-purple-600" /> Opportunities
          </span>
          <div className="text-3xl font-black text-purple-700 mt-1">{metrics.total_opportunities}</div>
          <span className="text-xs text-slate-400">Hackathons & Internships</span>
        </div>
      </div>

      {/* Analytics Visuals */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Top Trending Skills */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Top Trending Skills in College
              </h2>
            </div>
            <span className="text-xs text-slate-400 font-medium">Ranked by frequency</span>
          </div>

          <div className="space-y-3.5">
            {topSkills.map((sk) => {
              const percentage = Math.round((sk.count / maxSkillCount) * 100);
              return (
                <div key={sk.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-800">{sk.name}</span>
                    <span className="text-indigo-600">{sk.count} students proficient</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-sky-400 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Department Talent Distribution */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600" />
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Department Distribution
              </h2>
            </div>
            <span className="text-xs text-slate-400 font-medium">Engineers</span>
          </div>

          <div className="space-y-3">
            {deptDist.map((item) => (
              <div
                key={item.department}
                className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50 flex items-center justify-between"
              >
                <span className="text-xs font-semibold text-slate-800 pr-2">{item.department}</span>
                <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-indigo-600 shadow-xs shrink-0">
                  {item.students} {item.students === 1 ? 'student' : 'students'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
