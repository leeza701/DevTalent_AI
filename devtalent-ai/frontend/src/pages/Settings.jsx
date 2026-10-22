import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Settings as SettingsIcon, Bell, Shield, Key, Moon, Monitor, Database, Terminal, Cpu } from 'lucide-react';

const Settings = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('general');

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500">
      
      {/* Header Profile Section */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-[2rem] shadow-2xl border border-indigo-500/20 overflow-hidden relative group">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600 opacity-20 rounded-full blur-[100px] transform translate-x-1/2 -translate-y-1/2 group-hover:scale-125 transition-transform duration-1000"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600 opacity-10 rounded-full blur-[100px] transform -translate-x-1/2 translate-y-1/2"></div>
        
        <div className="px-10 py-12 relative z-10 flex items-center mb-2 border-b border-white/5">
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 mr-6 shadow-lg">
            <SettingsIcon className="w-10 h-10 text-indigo-400 animate-[spin_10s_linear_infinite]" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-white tracking-tight drop-shadow-md">Settings</h1>
            <p className="text-indigo-300 font-bold tracking-widest uppercase text-sm mt-2 flex items-center">
              <SettingsIcon className="w-4 h-4 mr-2" /> Global Preferences
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-3">
          {[
            { id: 'general', icon: Monitor, label: 'Appearance' },
            { id: 'security', icon: Shield, label: 'Security' },
            { id: 'notifications', icon: Bell, label: 'Notifications' },
            { id: 'developer', icon: Cpu, label: 'Developer Settings' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center space-x-3 px-5 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all duration-300 border ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)] border-transparent transform scale-[1.02]'
                  : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 shadow-sm'
              }`}
            >
              <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-white' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-10 h-full relative overflow-hidden group">
            
            {activeTab === 'general' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-2xl font-black text-slate-800 tracking-tight flex items-center border-b border-slate-100 pb-4">
                  <Monitor className="w-6 h-6 mr-3 text-indigo-500" /> Appearance
                </h3>
                
                <div className="space-y-6 pt-4">
                  <div className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-200 shadow-inner group-hover:border-indigo-100 transition-colors">
                    <div>
                      <h4 className="font-bold text-slate-800 mb-1">Dark Mode</h4>
                      <p className="text-sm font-medium text-slate-500">Enable dark theme across the application</p>
                    </div>
                    <button className="relative inline-flex h-7 w-14 items-center rounded-full bg-slate-300 transition-colors focus:outline-none">
                      <span className="inline-block h-5 w-5 transform rounded-full bg-white transition-transform translate-x-1" />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-200 shadow-inner group-hover:border-indigo-100 transition-colors">
                    <div>
                      <h4 className="font-bold text-slate-800 mb-1">Animations</h4>
                      <p className="text-sm font-medium text-slate-500">Enable UI animations and hover effects</p>
                    </div>
                    <button className="relative inline-flex h-7 w-14 items-center rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)] transition-colors focus:outline-none">
                      <span className="inline-block h-5 w-5 transform rounded-full bg-white transition-transform translate-x-8" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-2xl font-black text-slate-800 tracking-tight flex items-center border-b border-slate-100 pb-4">
                  <Shield className="w-6 h-6 mr-3 text-indigo-500" /> Security
                </h3>
                
                <div className="space-y-6 pt-4">
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
                    <label className="block text-xs font-black tracking-widest uppercase text-slate-400 mb-2">Two-Factor Authentication</label>
                    <div className="flex items-center space-x-3 mb-4">
                      <Shield className="w-5 h-5 text-emerald-500" />
                      <span className="font-bold text-emerald-600">Off (Not Required)</span>
                    </div>
                    <button className="px-5 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl shadow-sm hover:border-indigo-300 transition-colors">Enable 2FA</button>
                  </div>
                  
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
                    <label className="block text-xs font-black tracking-widest uppercase text-slate-400 mb-2">Change Password</label>
                    <p className="text-sm text-slate-500 font-medium mb-4">Update your account password to securely log in.</p>
                    <button className="px-5 py-3 bg-indigo-50 text-indigo-700 font-bold rounded-xl border border-indigo-100 hover:bg-indigo-100 transition-colors">Update Password</button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'developer' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-2xl font-black text-slate-800 tracking-tight flex items-center border-b border-slate-100 pb-4">
                  <Cpu className="w-6 h-6 mr-3 text-indigo-500" /> Developer Settings
                </h3>
                
                <div className="p-8 bg-gradient-to-br from-slate-900 to-indigo-950 rounded-2xl relative overflow-hidden group/dev border border-indigo-500/30">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 opacity-20 rounded-full blur-[40px] group-hover/dev:bg-purple-500 transition-colors duration-500"></div>
                  
                  <div className="relative z-10 mb-6">
                     <h4 className="font-black text-white text-lg flex items-center mb-1">
                       <Key className="w-4 h-4 mr-2 text-indigo-400" /> Gemini API Key
                     </h4>
                     <p className="text-xs font-bold uppercase tracking-widest text-indigo-300/70">Used for Resume Parsing</p>
                  </div>
                  
                  <div className="relative z-10 flex items-center space-x-4">
                    <input 
                      type="password" 
                      value="**************************************"
                      readOnly
                      className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-xl text-indigo-200 font-mono focus:outline-none shadow-inner"
                    />
                    <button className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-colors whitespace-nowrap shadow-[0_0_15px_rgba(79,70,229,0.3)]">
                      Update Key
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'notifications' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col items-center justify-center py-10">
                <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-4 border border-indigo-100">
                  <Bell className="w-10 h-10 text-indigo-400" />
                </div>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">Notifications Enabled</h3>
                <p className="text-slate-500 font-medium text-center">You will receive notifications for important platform events.</p>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
