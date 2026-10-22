import { useState, useEffect } from 'react';
import axios from 'axios';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem('devtalent_token');
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/jobs`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setJobs(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('devtalent_token');
      await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/jobs`,
        { title, company, originalDescription: description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setSuccess('Job successfully parsed and saved!');
      setTitle('');
      setCompany('');
      setDescription('');
      fetchJobs();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to parse job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Upload Section */}
      <div className="bg-gradient-to-l from-slate-800 to-slate-900 rounded-3xl shadow-xl p-8 border border-slate-700 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 opacity-20 rounded-full blur-[80px]"></div>
        <h2 className="text-3xl font-black text-white tracking-tight drop-shadow-md mb-6 relative z-10">Deploy Requisition Template</h2>
        
        {error && <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-lg">{error}</div>}
        {success && <div className="mb-4 p-4 text-green-700 bg-green-100 rounded-lg">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-300 uppercase tracking-widest mb-2">Target Title</label>
              <input
                type="text"
                required
                className="w-full px-5 py-4 rounded-2xl border-none outline-none focus:ring-4 focus:ring-indigo-500/30 transition-all font-semibold bg-white/10 text-white placeholder-slate-400 backdrop-blur-sm"
                placeholder="e.g. Senior Frontend Engineer"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-300 uppercase tracking-widest mb-2">Client / Organization</label>
              <input
                type="text"
                required
                className="w-full px-5 py-4 rounded-2xl border-none outline-none focus:ring-4 focus:ring-indigo-500/30 transition-all font-semibold bg-white/10 text-white placeholder-slate-400 backdrop-blur-sm"
                placeholder="e.g. DevTalent Labs"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-300 uppercase tracking-widest mb-2">Raw Descriptor (AI Parsing)</label>
            <textarea
              required
              rows="6"
              className="w-full px-5 py-4 rounded-2xl border-none outline-none focus:ring-4 focus:ring-indigo-500/30 transition-all font-semibold bg-white/10 text-white placeholder-slate-400 backdrop-blur-sm resize-none"
              placeholder="Paste the raw text of the job description here. Our multi-agent LLM will extract nodes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 px-6 text-white font-black uppercase tracking-widest rounded-2xl transition-all duration-300 bg-indigo-600 hover:bg-indigo-500 hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] disabled:opacity-50 flex justify-center items-center transform hover:-translate-y-1"
          >
            {loading ? (
              <span className="flex items-center space-x-2">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Extracting Target Vectors...</span>
              </span>
            ) : (
              'Parse Architecture Diagram'
            )}
          </button>
        </form>
      </div>

      {/* Display Section */}
      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden relative z-10 border border-slate-100 p-8">
        <h2 className="text-3xl font-black text-slate-800 tracking-tight drop-shadow-md mb-8">Active Blueprints</h2>
        
        {jobs.length === 0 ? (
          <p className="text-slate-400 font-bold text-center py-12">No active architectures mapped yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
            {jobs.map((job) => (
              <div key={job._id} className="p-8 rounded-3xl border border-indigo-50 bg-white hover:border-indigo-300 hover:shadow-[0_10px_30px_rgba(99,102,241,0.1)] transition-all duration-300 group flex flex-col justify-between">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-black text-slate-800 group-hover:text-indigo-600 transition-colors">{job.title}</h3>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-1">{job.company}</p>
                  </div>
                  <span className="bg-indigo-50 border border-indigo-100 text-indigo-500 text-xs font-black uppercase tracking-widest px-4 py-2 rounded-xl shadow-sm group-hover:bg-indigo-100 transition-colors">
                    Online
                  </span>
                </div>
                
                <div className="space-y-6 pt-6 border-t border-slate-100">
                  {/* AI Requirements */}
                  <div>
                    <h4 className="text-xs font-black tracking-widest uppercase text-slate-400 mb-3">AI Mapped Competencies</h4>
                    <div className="flex flex-wrap gap-2">
                      {job.requirements?.skills?.map((skill, index) => (
                        <span key={index} className="bg-slate-50 border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm group-hover:border-indigo-200 transition-colors">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 shadow-inner group-hover:bg-indigo-50/50 transition-colors">
                      <p className="text-[10px] text-slate-400 mb-1 font-black uppercase tracking-widest">Base Ex. Node</p>
                      <p className="font-black text-slate-700 text-lg">{job.requirements?.minYearsExperience} Yrs</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 shadow-inner group-hover:bg-indigo-50/50 transition-colors">
                      <p className="text-[10px] text-slate-400 mb-1 font-black uppercase tracking-widest">Edu Threshold</p>
                      <p className="font-bold text-slate-600 text-sm">{job.requirements?.education}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;
