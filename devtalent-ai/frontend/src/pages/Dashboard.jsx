import React, { useEffect, useState, useContext } from 'react';
import { Briefcase, Code, FileText, UserPlus, FileCheck, Search, Users, Activity, BarChart, Settings, LogOut, Trophy } from 'lucide-react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';

function Dashboard({ children }) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [healthStatus, setHealthStatus] = useState('Checking backend...');
  const [stats, setStats] = useState({ candidates: 0, jobs: 0, assessments: 0 });

  useEffect(() => {
    // Check backend health
    axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/health`)
      .then(response => {
        if (response.data.status === 'ok') {
          setHealthStatus('Backend Connected: OK');
        }
      })
      .catch(error => {
        console.error('Backend health check failed:', error);
        setHealthStatus('Backend Offline (Make sure it is running)');
      });

    // Fetch live dashboard metrics
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('devtalent_token');
        if (token) {
          const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/stats`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.data.success) {
            setStats(res.data.data);
          }
        }
      } catch (err) {
        console.error('Failed to load dashboard metrics', err);
      }
    };
    
    fetchStats();
  }, []);

  // Group navigation items by category for structured layout
  let categories = [];
  if (user?.role === 'recruiter') {
    categories = [
      {
        title: 'OVERVIEW',
        items: [
          { name: 'Dashboard', path: '/', icon: <Activity className="w-4 h-4 text-sky-400" /> },
          { name: 'Leaderboard', path: '/leaderboard', icon: <Trophy className="w-4 h-4 text-amber-400" /> },
        ]
      },
      {
        title: 'RECRUITMENT & SOURCING',
        items: [
          { name: 'Candidates', path: '/candidates', icon: <UserPlus className="w-4 h-4 text-indigo-400" /> },
          { name: 'Semantic Search', path: '/search', icon: <Search className="w-4 h-4 text-cyan-400" /> },
          { name: 'Team Builder', path: '/team-builder', icon: <Users className="w-4 h-4 text-purple-400" /> },
        ]
      },
      {
        title: 'REQUISITIONS & TESTS',
        items: [
          { name: 'Jobs Architecture', path: '/jobs', icon: <Briefcase className="w-4 h-4 text-blue-400" /> },
          { name: 'Assessments Studio', path: '/create-assessment', icon: <Code className="w-4 h-4 text-rose-400" /> },
          { name: 'Analytics', path: '/analytics', icon: <BarChart className="w-4 h-4 text-emerald-400" /> },
        ]
      }
    ];
  } else {
    categories = [
      {
        title: 'OVERVIEW',
        items: [
          { name: 'Dashboard', path: '/', icon: <Activity className="w-4 h-4 text-sky-400" /> },
          { name: 'Leaderboard', path: '/leaderboard', icon: <Trophy className="w-4 h-4 text-amber-400" /> },
        ]
      },
      {
        title: 'MY PORTFOLIO',
        items: [
          { name: 'Capability Profile', path: '/profile', icon: <FileCheck className="w-4 h-4 text-indigo-400" /> },
          { name: 'Resume Ingestor', path: '/resumes', icon: <FileText className="w-4 h-4 text-purple-400" /> },
          { name: 'Code Assessments', path: '/assessments', icon: <Code className="w-4 h-4 text-rose-400" /> },
        ]
      }
    ];
  }

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden font-sans">
      {/* Floating Glassmorphic Sidebar Layout */}
      <aside className="my-3 ml-3 w-64 bg-slate-900 text-slate-300 rounded-3xl border border-slate-800 flex flex-col justify-between shadow-[0_10px_40px_rgba(0,0,0,0.25)] relative z-20 overflow-hidden shrink-0">
        
        {/* Decorative Ambient Background Blur */}
        <div className="absolute top-[-50px] left-[-50px] w-40 h-40 bg-indigo-600 opacity-20 rounded-full blur-[60px] pointer-events-none"></div>
        <div className="absolute bottom-[-50px] right-[-50px] w-40 h-40 bg-purple-600 opacity-15 rounded-full blur-[60px] pointer-events-none"></div>

        <div>
          {/* Top Brand Header */}
          <div className="flex items-center space-x-3 px-5 py-5 border-b border-slate-800/80 relative z-10">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.5)] transform hover:scale-105 transition-transform cursor-pointer">
              <Code className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-lg font-black text-white tracking-tight leading-none">
                DevTalent <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">AI</span>
              </div>
              <span className="text-[9px] font-black uppercase tracking-wider text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded-md border border-indigo-400/20 mt-1 inline-block">
                {user?.role === 'recruiter' ? 'Recruiter Suite' : 'Developer Engine'}
              </span>
            </div>
          </div>

          {/* Categorized Navigation Sections */}
          <nav className="p-3 space-y-4 overflow-y-auto max-h-[calc(100vh-210px)] relative z-10">
            {categories.map((cat, idx) => (
              <div key={idx} className="space-y-1">
                <p className="px-3 text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1.5">{cat.title}</p>
                {cat.items.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <button 
                      key={item.name}
                      onClick={() => navigate(item.path)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 group ${
                        isActive
                          ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white shadow-[0_4px_15px_rgba(99,102,241,0.4)] translate-x-1' 
                          : 'hover:bg-slate-800/60 hover:text-white text-slate-400 hover:translate-x-1'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-1.5 rounded-lg transition-colors ${isActive ? 'bg-white/20' : 'bg-slate-800/80 group-hover:bg-slate-700'}`}>
                          {item.icon}
                        </div>
                        <span className="truncate">{item.name}</span>
                      </div>
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_white]"></span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>

        {/* Bottom Profile & Settings Card */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/60 relative z-10">
          <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-2xl flex items-center justify-between shadow-inner">
            <div className="flex items-center space-x-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center font-black text-xs shadow-md shrink-0">
                {user?.name ? user.name.substring(0, 2).toUpperCase() : 'AI'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-black text-white truncate">{user?.name || 'User'}</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider truncate">{user?.role || 'Guest'}</p>
              </div>
            </div>
            <div className="flex items-center space-x-1 shrink-0">
              <Link 
                to="/settings" 
                title="Settings"
                className={`p-1.5 rounded-lg transition-all ${
                  location.pathname === '/settings' 
                    ? 'bg-indigo-600 text-white' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Settings className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 bg-white justify-between items-center px-8 border-b border-slate-200 shadow-sm z-10">
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Overview</h1>
          <div className="flex items-center space-x-4">
            <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${healthStatus.includes('OK') ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'} shadow-sm flex items-center`}>
              <span className={`w-2 h-2 rounded-full mr-2 ${healthStatus.includes('OK') ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></span>
              {healthStatus}
            </span>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-slate-700 hidden sm:block">
                {user?.name || 'Developer'}
              </span>
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 text-white flex items-center justify-center font-bold shadow-md cursor-pointer hover:shadow-lg transition-shadow">
                {user?.name ? user.name.substring(0, 2).toUpperCase() : 'AD'}
              </div>
              <button 
                onClick={logout}
                className="ml-2 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                title="Log out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Dynamic Canvas */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 p-8">
          {children || (
            <div className="max-w-7xl mx-auto space-y-6">
              
              {/* Welcome Banner */}
              <div className="bg-gradient-to-r from-violet-600 via-fuchsia-600 to-orange-500 rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden group">
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/2 group-hover:scale-125 transition-transform duration-1000"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-400 opacity-20 rounded-full blur-2xl transform -translate-x-1/2 translate-y-1/3 group-hover:scale-150 transition-transform duration-1000"></div>
                
                <div className="absolute top-0 right-10 p-8 opacity-20 transform translate-x-4 -translate-y-4 group-hover:rotate-12 group-hover:scale-110 transition-all duration-700">
                  <Code className="w-56 h-56" />
                </div>
                
                <div className="relative z-10 p-2">
                  <h2 className="text-5xl font-black mb-4 tracking-tight drop-shadow-md">Welcome to DevTalent AI</h2>
                  <p className="text-white/90 max-w-xl text-xl mt-4 leading-relaxed font-medium backdrop-blur-sm bg-black/10 p-4 rounded-2xl border border-white/10">
                    The ultimate evidence-based developer intelligence platform. Evaluate capabilities, leverage LLM diagnostics, and instantly build elite engineering pods.
                  </p>
                  <button className="mt-10 bg-white text-violet-700 px-8 py-3.5 rounded-2xl font-black text-lg shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:bg-slate-50 hover:shadow-[0_0_35px_rgba(255,255,255,0.6)] transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 active:scale-95 flex items-center">
                    Get Started <Activity className="w-5 h-5 ml-2 animate-pulse" />
                  </button>
                </div>
              </div>
  
              {/* Dashboard Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { title: 'Total Candidates', value: stats.candidates, icon: <Users className="w-8 h-8 text-blue-500" />, ring: 'group-hover:ring-blue-100' },
                  { title: 'Active Jobs', value: stats.jobs, icon: <Briefcase className="w-8 h-8 text-purple-500" />, ring: 'group-hover:ring-purple-100' },
                  { title: 'Assessments Pending', value: stats.assessments, icon: <Code className="w-8 h-8 text-emerald-500" />, ring: 'group-hover:ring-emerald-100' }
                ].map((stat, i) => (
                  <div key={i} className={`bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl border border-slate-100 transition-all duration-400 flex items-center justify-between group cursor-pointer hover:-translate-y-3 hover:scale-105 ring-4 ring-transparent ${stat.ring}`}>
                    <div>
                      <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-2">{stat.title}</h3>
                      <p className="text-4xl font-black text-slate-800 bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-500">{stat.value}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl group-hover:scale-125 group-hover:rotate-6 transition-transform duration-300 shadow-inner border border-slate-100">
                      {stat.icon}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Action Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {user?.role === 'recruiter' ? (
                  <>
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 hover:shadow-2xl hover:border-purple-200 hover:-translate-y-2 hover:scale-[1.02] transition-all duration-400 group relative overflow-hidden">
                      <div className="absolute -right-10 -top-10 bg-purple-50 w-40 h-40 rounded-full blur-2xl group-hover:bg-purple-100 transition-colors"></div>
                      <div className="flex items-center mb-6 relative z-10">
                        <div className="bg-purple-100 p-4 rounded-2xl mr-5 group-hover:scale-110 transition-transform duration-300">
                          <Briefcase className="w-8 h-8 text-purple-600" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-800">Post a Job</h3>
                      </div>
                      <p className="text-slate-500 mb-8 font-medium leading-relaxed relative z-10 text-lg">
                        Create job requisitions. The AI will instantly convert raw descriptions into strict technical parameters.
                      </p>
                      <button onClick={() => navigate('/jobs')} className="w-full bg-purple-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-purple-700 shadow-lg shadow-purple-600/30 hover:shadow-purple-600/50 transition-all active:scale-95">
                        Create Requisition
                      </button>
                    </div>
                    
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 hover:shadow-2xl hover:border-blue-200 hover:-translate-y-2 hover:scale-[1.02] transition-all duration-400 group relative overflow-hidden">
                      <div className="absolute -right-10 -top-10 bg-blue-50 w-40 h-40 rounded-full blur-2xl group-hover:bg-blue-100 transition-colors"></div>
                      <div className="flex items-center mb-6 relative z-10">
                        <div className="bg-blue-100 p-4 rounded-2xl mr-5 group-hover:scale-110 transition-transform duration-300">
                          <Search className="w-8 h-8 text-blue-600" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-800">Match Candidates</h3>
                      </div>
                      <p className="text-slate-500 mb-8 font-medium leading-relaxed relative z-10 text-lg">
                        Use the Semantic Engine to instantly rank the global candidate pool against your open positions.
                      </p>
                      <button onClick={() => navigate('/search')} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-blue-700 shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 transition-all active:scale-95">
                        Run Analysis
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 hover:shadow-2xl hover:border-emerald-200 hover:-translate-y-2 hover:scale-[1.02] transition-all duration-400 group relative overflow-hidden">
                      <div className="absolute -right-10 -top-10 bg-emerald-50 w-40 h-40 rounded-full blur-2xl group-hover:bg-emerald-100 transition-colors"></div>
                      <div className="flex items-center mb-6 relative z-10">
                        <div className="bg-emerald-100 p-4 rounded-2xl mr-5 group-hover:scale-110 transition-transform duration-300">
                          <FileCheck className="w-8 h-8 text-emerald-600" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-800">Capability Profile</h3>
                      </div>
                      <p className="text-slate-500 mb-8 font-medium leading-relaxed relative z-10 text-lg">
                        Watch your AI-extracted metrics beautifully rendered on a visual dashboard to understand your placement.
                      </p>
                      <button onClick={() => navigate('/profile')} className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-emerald-700 shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/50 transition-all active:scale-95">
                        View Profile
                      </button>
                    </div>

                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 hover:shadow-2xl hover:border-blue-200 hover:-translate-y-2 hover:scale-[1.02] transition-all duration-400 group relative overflow-hidden">
                      <div className="absolute -right-10 -top-10 bg-blue-50 w-40 h-40 rounded-full blur-2xl group-hover:bg-blue-100 transition-colors"></div>
                      <div className="flex items-center mb-6 relative z-10">
                        <div className="bg-blue-100 p-4 rounded-2xl mr-5 group-hover:scale-110 transition-transform duration-300">
                          <FileText className="w-8 h-8 text-blue-600" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-800">Parse Resumes (Phase 3)</h3>
                      </div>
                      <p className="text-slate-500 mb-8 font-medium leading-relaxed relative z-10 text-lg">
                        Upload developer resumes here. The AI will extract key technologies, soft skills, and automatically link them.
                      </p>
                      <button onClick={() => navigate('/resumes')} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-blue-700 shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 transition-all active:scale-95">
                        Upload Now
                      </button>
                    </div>
                  </>
                )}
              </div>
  
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
