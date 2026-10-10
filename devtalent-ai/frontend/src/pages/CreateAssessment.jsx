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
      await axios.post('http://localhost:5000/api/assessments/custom', formData, {
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
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-8">
        <div className="flex items-center mb-4">
          <div className="bg-rose-100 p-3 rounded-xl mr-4">
            <PenTool className="w-8 h-8 text-rose-600" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Assessment Studio</h2>
            <p className="text-slate-500 mt-1">Design custom technical evaluations that instantly deploy to your talent pool.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Container */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-100 shadow-sm p-8">
          <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
            <Target className="w-5 h-5 mr-2 text-rose-500" /> Assessment Configuration
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Track Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="e.g. Senior React Migration Challenge"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Evaluation Thesis</label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Describe the objective and strict criteria evaluated in this track..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Simulated Time Limit (Minutes)</label>
              <select
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors bg-white"
              >
                <option value="30">30 Minutes</option>
                <option value="45">45 Minutes</option>
                <option value="60">60 Minutes</option>
                <option value="90">90 Minutes</option>
                <option value="120">120 Minutes (Architecture)</option>
              </select>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-rose-600 text-white font-bold rounded-xl shadow-md hover:bg-rose-700 hover:shadow-lg transition-all disabled:opacity-50"
            >
              {loading ? 'Deploying to Candidates...' : 'Create & Deploy Assessment'}
            </button>
            
            {success && (
              <div className="p-4 bg-emerald-50 text-emerald-700 rounded-xl flex items-center border border-emerald-100 font-medium">
                <ShieldCheck className="w-5 h-5 mr-3" />
                Assessment track live! It is now visible globally to all developers.
              </div>
            )}
          </form>
        </div>

        {/* Info Sidebar */}
        <div className="bg-slate-900 rounded-xl p-8 border border-slate-700 text-white shadow-xl h-fit">
          <h3 className="text-xl font-bold mb-6 flex items-center text-rose-300">
            <Database className="w-5 h-5 mr-2" /> Data Synchronization
          </h3>
          <p className="text-slate-300 text-sm leading-relaxed mb-6 font-light">
            Once created, this assessment is securely flushed to the NoSQL cluster. 
            All developers on the DevTalent AI platform will immediately see this new track globally available in their coding portal.
          </p>
          <div className="space-y-4 text-xs font-mono text-slate-400 bg-slate-800 p-4 rounded-lg">
            <p className="flex justify-between border-b border-slate-700 pb-2"><span>Status</span><span className="text-emerald-400">Connected</span></p>
            <p className="flex justify-between border-b border-slate-700 pb-2"><span>Global Relay</span><span className="text-blue-400">Active</span></p>
            <p className="flex justify-between"><span>Encrypted Link</span><span className="text-purple-400">AES-256</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAssessment;
