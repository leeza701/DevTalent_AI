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
      const response = await axios.get(`\${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/resumes/all`, {
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
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Global Candidate Directory</h2>
            <p className="text-slate-500 mt-1">Browse and filter {candidates.length} AI-verified developer capability profiles.</p>
          </div>
          
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium"
              placeholder="Search by skill, capability, or name..."
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Activity className="w-8 h-8 text-indigo-500 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredCandidates.map((candidate, idx) => (
            <div key={candidate._id || idx} className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all group">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center border border-indigo-50 flex-shrink-0">
                    <UserCircle className="w-8 h-8 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {candidate.user?.name || 'Anonymous Developer'}
                    </h3>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-slate-500">
                      <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" /> Remote</span>
                      <span className="flex items-center"><Briefcase className="w-4 h-4 mr-1" /> {candidate.experience?.length || 0} Roles</span>
                    </div>
                  </div>
                </div>
                <button className="p-2 bg-slate-50 text-slate-400 rounded-lg group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-6">
                <p className="text-sm font-semibold text-slate-700 mb-3 flex items-center">
                  <FileText className="w-4 h-4 mr-2 text-indigo-400" />
                  Extracted Competencies
                </p>
                <div className="flex flex-wrap gap-2">
                  {candidate.skills && candidate.skills.slice(0, 6).map((skill, sIdx) => (
                    <span key={sIdx} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold border border-indigo-100">
                      {skill}
                    </span>
                  ))}
                  {candidate.skills && candidate.skills.length > 6 && (
                    <span className="px-3 py-1 bg-slate-50 text-slate-500 rounded-lg text-xs font-bold border border-slate-200">
                      +{candidate.skills.length - 6} more
                    </span>
                  )}
                  {(!candidate.skills || candidate.skills.length === 0) && (
                    <span className="text-xs text-slate-400 font-medium">Pending AI Analysis</span>
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
