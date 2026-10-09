import React, { useEffect, useState, useContext } from 'react';
import { Briefcase, Code, FileText, UserPlus, FileCheck, Search, Users, Activity, BarChart, Settings, LogOut } from 'lucide-react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const [healthStatus, setHealthStatus] = useState('Checking backend...');

  useEffect(() => {
    // Check backend health
    axios.get('http://localhost:5000/api/health')
      .then(response => {
        if (response.data.status === 'ok') {
          setHealthStatus('Backend Connected: OK');
        }
      })
      .catch(error => {
        console.error('Backend health check failed:', error);
        setHealthStatus('Backend Offline (Make sure it is running)');
      });
  }, []);

  const navItems = [
    { name: 'Dashboard', icon: <Activity className="w-5 h-5 mr-3" /> },
    { name: 'Candidates', icon: <UserPlus className="w-5 h-5 mr-3" /> },
    { name: 'Resumes', icon: <FileText className="w-5 h-5 mr-3" /> },
    { name: 'Jobs', icon: <Briefcase className="w-5 h-5 mr-3" /> },
    { name: 'Capability Profiles', icon: <FileCheck className="w-5 h-5 mr-3" /> },
    { name: 'Semantic Search', icon: <Search className="w-5 h-5 mr-3" /> },
    { name: 'Assessments', icon: <Code className="w-5 h-5 mr-3" /> },
    { name: 'Team Builder', icon: <Users className="w-5 h-5 mr-3" /> },
    { name: 'Analytics', icon: <BarChart className="w-5 h-5 mr-3" /> },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar sidebar */}
      <div className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="flex items-center justify-center py-6 px-4 border-b border-slate-100">
          <div className="text-2xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent transform hover:scale-105 transition-transform duration-300">
            DevTalent AI
          </div>
        </div>
        
        <nav className="flex-1 overflow-y-auto pt-4 pb-4">
          <ul className="space-y-1">
            {navItems.map((item, index) => (
              <li key={item.name} className="px-3">
                <a 
                  href="#" 
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group
                    ${index === 0 
                      ? 'bg-blue-50 text-blue-700 shadow-sm' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-blue-600'
                    }`}
                >
                  <span className={`${index === 0 ? 'text-blue-600' : 'text-slate-400 group-hover:text-blue-500'} transition-colors duration-200`}>
                    {item.icon}
                  </span>
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="p-4 border-t border-slate-200">
          <a href="#" className="flex items-center px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-blue-600 rounded-xl transition-colors duration-200 group">
            <Settings className="w-5 h-5 mr-3 text-slate-400 group-hover:text-blue-500" />
            Settings
          </a>
        </div>
      </div>

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
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Welcome Banner */}
            <div className="bg-gradient-to-br from-blue-700 via-indigo-800 to-purple-900 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-12 opacity-10 transform translate-x-8 -translate-y-8 group-hover:scale-110 transition-transform duration-700">
                <Code className="w-48 h-48" />
              </div>
              <div className="relative z-10">
                <h2 className="text-3xl font-bold mb-2">Welcome to DevTalent AI</h2>
                <p className="text-blue-100 max-w-xl text-lg mt-4 leading-relaxed font-light">
                  The ultimate evidence-based developer talent intelligence platform. Start evaluating capabilities, parsing resumes, and running simulations to build elite engineering teams.
                </p>
                <button className="mt-8 bg-white text-indigo-700 px-6 py-2.5 rounded-lg font-bold shadow-lg hover:bg-blue-50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5">
                  Get Started
                </button>
              </div>
            </div>

            {/* Dashboard Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: 'Total Candidates', value: '0', icon: <Users className="w-8 h-8 text-blue-500" /> },
                { title: 'Active Jobs', value: '0', icon: <Briefcase className="w-8 h-8 text-purple-500" /> },
                { title: 'Assessments Pending', value: '0', icon: <Code className="w-8 h-8 text-emerald-500" /> }
              ].map((stat, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300 flex items-center justify-between group cursor-pointer">
                  <div>
                    <h3 className="text-slate-500 text-sm font-medium mb-1">{stat.title}</h3>
                    <p className="text-3xl font-bold text-slate-800">{stat.value}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    {stat.icon}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 hover:border-blue-200 transition-colors duration-300">
                <div className="flex items-center mb-6">
                  <div className="bg-blue-100 p-3 rounded-xl mr-4">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">Parse Resumes (Phase 3)</h3>
                </div>
                <p className="text-slate-500 mb-6 font-light leading-relaxed">
                  Upload developer resumes here. The AI will extract key technologies, soft skills, and automatically link them to capability tracks.
                </p>
                <button className="w-full bg-slate-100 text-slate-600 border border-slate-200 py-3 rounded-xl font-medium hover:bg-slate-200 transition-colors cursor-not-allowed opacity-70">
                  Coming Soon
                </button>
              </div>
              
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 hover:border-indigo-200 transition-colors duration-300">
                <div className="flex items-center mb-6">
                  <div className="bg-indigo-100 p-3 rounded-xl mr-4">
                    <Code className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">Add Technical Assesment (Phase 9)</h3>
                </div>
                <p className="text-slate-500 mb-6 font-light leading-relaxed">
                  Create evidence-based, secure project simulations to automatically evaluate developer capability using AI analysis grids.
                </p>
                <button className="w-full bg-slate-100 text-slate-600 border border-slate-200 py-3 rounded-xl font-medium hover:bg-slate-200 transition-colors cursor-not-allowed opacity-70">
                  Coming Soon
                </button>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
