import { useState } from 'react';
import axios from 'axios';
import { PenTool, Target, Clock, ShieldCheck, Database } from 'lucide-react';

const CreateAssessment = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '45',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    try {
      const token = localStorage.getItem('devtalent_token');
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/assessments/custom`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess(true);
      setFormData({ title: '', description: '', duration: '45' });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setTimeout(() => setSuccess(false), 5000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-600 via-pink-600 to-rose-800 rounded-[2rem] shadow-2xl p-10 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-20 rounded-full blur-[80px] transform translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-1000"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay"></div>
        
        <div className="flex items-center mb-4 relative z-10">
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 mr-6 shadow-lg shadow-rose-900/30 group-hover:-translate-y-2 group-hover:rotate-6 transition-all">
            <PenTool className="w-10 h-10 text-white" />
          </div>
          <div>
            <h2 className="text-4xl font-black text-white tracking-tight drop-shadow-md">Assessment Studio</h2>
            <p className="text-rose-100 mt-2 text-lg font-medium">Design custom technical evaluations that deploy to the global talent pool.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Container */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-10 relative z-10 transition-all hover:shadow-[0_10px_40px_rgba(225,29,72,0.1)]">
          <h3 className="text-2xl font-black text-slate-800 mb-8 flex items-center tracking-tight">
            <Target className="w-6 h-6 mr-3 text-rose-500" /> Track Configuration
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="group/input">
              <label className="block text-xs font-black tracking-widest uppercase text-slate-400 mb-2 group-hover/input:text-rose-500 transition-colors">Track Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="e.g. Senior React Migration Challenge"
                className="w-full px-5 py-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-4 focus:ring-rose-500/20 text-slate-800 font-bold placeholder-slate-400 shadow-inner transition-all hover:bg-slate-100"
              />
            </div>
            
            <div className="group/input">
              <label className="block text-xs font-black tracking-widest uppercase text-slate-400 mb-2 group-hover/input:text-rose-500 transition-colors">Evaluation Thesis</label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Describe the objective and strict criteria evaluated in this track..."
                className="w-full px-5 py-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-4 focus:ring-rose-500/20 text-slate-800 font-bold placeholder-slate-400 shadow-inner transition-all hover:bg-slate-100 resize-none"
              />
            </div>
            
            <div className="group/input">
              <label className="block text-xs font-black tracking-widest uppercase text-slate-400 mb-2 group-hover/input:text-rose-500 transition-colors">Simulated Time Limit</label>
              <select
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: e.target.value})}
                className="w-full px-5 py-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-4 focus:ring-rose-500/20 text-slate-800 font-bold shadow-inner transition-all hover:bg-slate-100 cursor-pointer appearance-none"
              >
                <option value="30">30 Minutes (Rapid)</option>
                <option value="45">45 Minutes (Standard)</option>
                <option value="60">60 Minutes (Deep)</option>
                <option value="90">90 Minutes (Extensive)</option>
                <option value="120">120 Minutes (Architecture)</option>
              </select>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-black uppercase tracking-widest rounded-2xl shadow-[0_0_20px_rgba(225,29,72,0.4)] hover:shadow-[0_0_30px_rgba(244,63,94,0.6)] transition-all disabled:opacity-50 transform hover:-translate-y-1"
            >
              {loading ? 'Deploying Assessment...' : 'Deploy Assessment Track'}
            </button>
            
            {success && (
              <div className="p-5 bg-emerald-500/10 text-emerald-600 rounded-2xl flex items-center border border-emerald-500/20 font-black animate-in fade-in zoom-in-95">
                <ShieldCheck className="w-6 h-6 mr-3" />
                Assessment track live! It is now visible to all candidates.
              </div>
            )}
          </form>
        </div>

        {/* Info Sidebar */}
        <div className="bg-slate-900 rounded-3xl p-10 border border-slate-700 shadow-2xl relative overflow-hidden h-fit group">
          <div className="absolute top-[-50px] right-[-50px] w-32 h-32 bg-rose-500 opacity-20 rounded-full blur-[40px] group-hover:bg-purple-500 transition-colors duration-700"></div>
          <h3 className="text-2xl font-black mb-6 flex items-center text-white tracking-tight relative z-10">
            <Database className="w-6 h-6 mr-3 text-rose-500" /> Data Synchronization
          </h3>
          <p className="text-slate-400 text-sm leading-relaxed mb-8 font-medium relative z-10">
            Once created, this assessment is securely saved to the database. 
            All developers on the <span className="text-rose-400 font-bold">DevTalent AI</span> platform will immediately see this new test globally available in their coding portal.
          </p>
          <div className="space-y-4 text-xs font-black uppercase tracking-widest text-slate-400 bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-inner relative z-10">
            <p className="flex justify-between border-b border-slate-800 pb-3"><span>Database Status</span><span className="text-emerald-400">Connected</span></p>
            <p className="flex justify-between border-b border-slate-800 pb-3"><span>Global Sync</span><span className="text-blue-400">Active</span></p>
            <p className="flex justify-between"><span>Connection</span><span className="text-purple-400">Secure AES-256</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAssessment;
