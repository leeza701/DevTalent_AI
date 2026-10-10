import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, ScatterChart, Scatter, ZAxis, Legend } from 'recharts';
import { BarChart as BarChartIcon, TrendingUp, Users, Target, Activity } from 'lucide-react';

// Mock Data Arrays
const performanceDistribution = [
  { score: '0-20', candidates: 4 },
  { score: '21-40', candidates: 12 },
  { score: '41-60', candidates: 45 },
  { score: '61-80', candidates: 89 },
  { score: '81-100', candidates: 34 },
];

const trackPopularity = [
  { name: 'Full-Stack', taken: 145, passed: 98 },
  { name: 'Backend', taken: 112, passed: 65 },
  { name: 'Data Sci', taken: 89, passed: 42 },
  { name: 'DevOps', taken: 54, passed: 31 },
];

const TimeVsScoreScatter = [
  { time: 15, score: 95, candidates: 12 },
  { time: 30, score: 85, candidates: 40 },
  { time: 45, score: 70, candidates: 85 },
  { time: 60, score: 45, candidates: 30 },
  { time: 75, score: 30, candidates: 10 },
];

const Analytics = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-8">
        <div className="flex items-center mb-2">
          <div className="bg-purple-100 p-3 rounded-xl mr-4">
            <BarChartIcon className="w-8 h-8 text-purple-600" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Global Analytics</h2>
            <p className="text-slate-500 mt-1">Deep visual tracking of candidate performance across all assessment modules.</p>
          </div>
        </div>
      </div>

      {/* KPI Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Avg Platform Score', val: '72.4%', icon: <Activity className="w-6 h-6 text-emerald-500" />, trend: '+4.2%' },
          { label: 'Highest Pass Rate', val: 'Full-Stack', icon: <Target className="w-6 h-6 text-indigo-500" />, trend: 'Stable' },
          { label: 'Total Completions', val: '400', icon: <Users className="w-6 h-6 text-blue-500" />, trend: '+12.5%' },
          { label: 'Avg Time Spent', val: '41 Min', icon: <TrendingUp className="w-6 h-6 text-amber-500" />, trend: '-2.1%' }
        ].map((kpi, i) => (
          <div key={i} className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                {kpi.icon}
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${kpi.trend.includes('+') ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                {kpi.trend}
              </span>
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">{kpi.label}</p>
              <h3 className="text-2xl font-black text-slate-800">{kpi.val}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Primary Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Pass Rate Distribution */}
        <div className="bg-white rounded-xl p-8 border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
            Overall Score Distribution Curve
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCandidates" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="score" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <RechartsTooltip cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="candidates" stroke="#7c3aed" strokeWidth={3} fillOpacity={1} fill="url(#colorCandidates)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Track Popularity */}
        <div className="bg-white rounded-xl p-8 border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">
            Track Participation vs Pass Rate
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trackPopularity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <RechartsTooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
                <Bar dataKey="taken" fill="#94a3b8" radius={[4, 4, 0, 0]} name="Total Attempts" maxBarSize={40} />
                <Bar dataKey="passed" fill="#10b981" radius={[4, 4, 0, 0]} name="Passed" maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Scatter Correlation */}
        <div className="bg-white rounded-xl p-8 border border-slate-100 shadow-sm lg:col-span-2">
          <h3 className="text-lg font-bold text-slate-900 mb-6">
            Completion Time (Minutes) vs Final Score
          </h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" dataKey="time" name="Time Spent" unit=" mins" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis type="number" dataKey="score" name="Score" unit="%" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <ZAxis type="number" dataKey="candidates" range={[100, 1000]} name="Density" />
                <RechartsTooltip cursor={{strokeDasharray: '3 3'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Scatter name="Assessments" data={TimeVsScoreScatter} fill="#3b82f6" fillOpacity={0.7} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Analytics;
