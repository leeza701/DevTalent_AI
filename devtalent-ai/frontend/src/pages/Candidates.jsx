import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, UserCircle, Briefcase, FileText, ChevronRight, Activity, MapPin } from 'lucide-react';

function Candidates() {
  const [candidates, setCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('devtalent_token');
      const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/resumes/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.data) {
        setCandidates(response.data.data);
        setFilteredCandidates(response.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch candidates', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    if (!query) {
      setFilteredCandidates(candidates);
      return;
    }
    
    const matched = candidates.filter(candidate => {
      const skillsStr = (candidate.skills || []).join(' ').toLowerCase();
      const rawTextStr = (candidate.rawText || '').toLowerCase();
      const nameStr = (candidate.user?.name || '').toLowerCase();
      return skillsStr.includes(query) || rawTextStr.includes(query) || nameStr.includes(query);
    });
    
    setFilteredCandidates(matched);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Header and Search */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 rounded-3xl shadow-xl p-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-1000"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <h2 className="text-3xl font-black text-white tracking-tight drop-shadow-md">Global Candidates</h2>
            <p className="text-indigo-200 font-medium mt-1">Browse and instantly filter {candidates.length} AI-verified engineering profiles.</p>
          </div>
          
          <div className="relative w-full md:w-96 group/search">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-indigo-300 group-focus-within/search:text-indigo-600 transition-colors" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              className="block w-full pl-12 pr-4 py-3.5 border-none rounded-2xl leading-5 bg-white/10 backdrop-blur-md text-white placeholder-indigo-200 focus:outline-none focus:bg-white focus:text-slate-800 transition-all shadow-inner font-semibold"
              placeholder="Search by exact skill, capability, or name..."
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Activity className="w-8 h-8 text-indigo-500 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
          {filteredCandidates.map((candidate, idx) => (
            <div key={candidate._id || idx} className="bg-white rounded-3xl border border-indigo-50 p-6 shadow-md hover:shadow-2xl hover:-translate-y-2 hover:border-indigo-200 transition-all duration-300 group relative overflow-hidden flex flex-col justify-between">
              
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-indigo-50 to-transparent rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>

              <div className="flex items-start justify-between z-10">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/30 transform group-hover:rotate-12 transition-transform duration-300">
                    {candidate.user?.name ? candidate.user.name.substring(0, 2).toUpperCase() : <UserCircle className="w-8 h-8 opacity-80" />}
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-800 group-hover:text-indigo-600 transition-colors">
                      {candidate.user?.name || 'Anonymous Developer'}
                    </h3>
                    <div className="flex items-center space-x-4 mt-1 text-xs font-bold text-slate-400 uppercase tracking-widest">
                      <span className="flex items-center bg-slate-50 px-2 py-1 rounded-md"><MapPin className="w-3 h-3 mr-1 text-slate-400" /> Remote Base</span>
                      <span className="flex items-center bg-slate-50 px-2 py-1 rounded-md"><Briefcase className="w-3 h-3 mr-1 text-slate-400" /> {candidate.experience?.length || 0} Ex. Nodes</span>
                    </div>
                  </div>
                </div>
                <button className="p-3 bg-indigo-50 text-indigo-400 rounded-xl group-hover:bg-indigo-600 group-hover:text-white group-hover:shadow-lg transition-all duration-300 hover:scale-110">
                  <ChevronRight className="w-5 h-5 font-black" />
                </button>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 z-10 bg-gradient-to-b from-transparent to-slate-50/50 -mx-6 px-6 -mb-6 pb-6">
                <p className="text-xs font-black tracking-widest uppercase text-slate-400 mb-3 flex items-center">
                  <FileText className="w-4 h-4 mr-2 text-indigo-400" />
                  AI Computed Competencies
                </p>
                <div className="flex flex-wrap gap-2">
                  {candidate.skills && candidate.skills.slice(0, 6).map((skill, sIdx) => (
                    <span key={sIdx} className="px-3 py-1.5 bg-white text-indigo-700 rounded-lg text-xs font-bold border border-indigo-100 shadow-sm group-hover:border-indigo-200 transition-colors">
                      {skill}
                    </span>
                  ))}
                  {candidate.skills && candidate.skills.length > 6 && (
                    <span className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold border border-slate-200 shadow-inner">
                      +{candidate.skills.length - 6} more
                    </span>
                  )}
                  {(!candidate.skills || candidate.skills.length === 0) && (
                    <span className="text-xs text-slate-400 font-medium bg-slate-50 px-3 py-1 rounded-lg">Pending Extraction Sequence</span>
                  )}
                </div>
              </div>
            </div>
          ))}

          {filteredCandidates.length === 0 && (
             <div className="col-span-1 lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-12 text-center">
               <UserCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
               <h3 className="text-lg font-bold text-slate-700">No candidates match your criteria.</h3>
               <p className="text-slate-500 mt-2">Try searching for a different framework or skill.</p>
             </div>
          )}
        </div>
      )}

    </div>
  );
}

export default Candidates;
