import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Briefcase, ChevronRight, Award, MapPin, User, ChevronDown, Activity } from 'lucide-react';

const SemanticSearch = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState('');
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    // Fetch available jobs for the dropdown
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
    fetchJobs();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!selectedJob) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('devtalent_token');
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/matches/${selectedJob}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMatches(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setHasSearched(true);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Search Header */}
      <div className="bg-gradient-to-br from-slate-900 to-indigo-900 rounded-3xl border border-indigo-800/50 shadow-2xl p-10 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500 opacity-20 rounded-full blur-[100px] transform translate-x-1/3 -translate-y-1/2 group-hover:bg-purple-500 transition-colors duration-1000"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        
        <div className="flex items-center mb-10 relative z-10">
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 mr-6 shadow-lg shadow-indigo-500/20 group-hover:rotate-6 transition-transform">
            <Search className="w-10 h-10 text-indigo-300" />
          </div>
          <div>
            <h2 className="text-4xl font-black text-white tracking-tight drop-shadow-md">Semantic Matching Engine</h2>
            <p className="text-indigo-200 mt-2 text-lg font-medium max-w-2xl">Use our AI to automatically match developers to your open jobs based on their skills and experience.</p>
          </div>
        </div>
        
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 items-end relative z-10">
          <div className="flex-1 w-full relative group/input">
            <label className="block text-sm font-bold text-indigo-300 uppercase tracking-widest mb-3">Requisition Target Sequence</label>
            <div className="relative">
              <select
                value={selectedJob}
                onChange={(e) => setSelectedJob(e.target.value)}
                className="w-full appearance-none px-6 py-5 rounded-2xl border border-white/10 hover:border-indigo-400 focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-400 bg-white/5 backdrop-blur-md text-white font-bold cursor-pointer transition-all shadow-inner"
              >
                <option value="" disabled className="text-slate-800">-- Initialize Target Pipeline --</option>
                {jobs.map(job => (
                  <option key={job._id} value={job._id} className="text-slate-800">{job.title} - {job.company}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-6 text-indigo-300 group-hover/input:text-white transition-colors">
                <ChevronDown className="w-6 h-6" />
              </div>
            </div>
          </div>
          <button
            type="submit"
            disabled={!selectedJob || loading}
            className="h-[68px] px-10 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-black rounded-2xl shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center transform hover:-translate-y-1"
          >
            {loading ? <span className="flex items-center justify-center animate-pulse"><Search className="w-5 h-5 mr-2" /> Searching...</span> : 'Find Best Candidates'}
          </button>
        </form>
      </div>

      {/* Results Section */}
      {!loading && hasSearched && matches.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center">
          <p className="text-gray-500 font-medium">No candidate profiles found in the database. Please navigate to the "Resumes" tab and upload a test developer resume first!</p>
        </div>
      )}

      {matches.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 overflow-hidden">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <Award className="w-6 h-6 mr-2 text-yellow-500" />
            Ranked Candidates
          </h3>
          
          <div className="space-y-4">
            {matches.map((match, index) => (
              <div key={match._id} className="relative bg-slate-50 border border-slate-200 rounded-2xl p-6 hover:shadow-lg hover:border-blue-300 transition-all duration-300">
                
                {/* Ranking Medal */}
                <div className="absolute top-0 left-0 -mt-3 -ml-3 w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-md border-4 border-white z-10 
                  ${index === 0 ? 'bg-yellow-400' : index === 1 ? 'bg-slate-400' : index === 2 ? 'bg-amber-600' : 'bg-blue-500'}">
                  #{index + 1}
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 ml-4">
                  
                  {/* Candidate Info */}
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <User className="w-5 h-5 text-gray-400 mr-2" />
                      <h4 className="text-lg font-bold text-gray-900 truncate">{match.fileName.split('.pdf')[0].replace(/_/g, ' ') || 'Candidate Profile'}</h4>
                    </div>
                    
                    <div className="mt-4">
                      <p className="text-xs uppercase font-bold text-gray-400 tracking-wider mb-2">Algorithm Match Analysis (Top Skills)</p>
                      <div className="flex flex-wrap gap-2">
                        {match.candidateSkills?.slice(0, 5).map((skill, i) => {
                          const isMatched = match.matchedSkills.some(s => s.toLowerCase() === skill.toLowerCase());
                          return (
                            <span 
                              key={i} 
                              className={`px-3 py-1 rounded-full text-xs font-bold border ${isMatched ? 'bg-green-100 text-green-700 border-green-200' : 'bg-white text-gray-500 border-gray-200'}`}
                            >
                              {skill}
                            </span>
                          )
                        })}
                        {match.candidateSkills?.length > 5 && (
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-500 border border-gray-200">
                            +{match.candidateSkills.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Match Score UI */}
                  <div className="w-full md:w-64 flex flex-col items-center p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                    <div className="text-3xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                      {match.score}% MATCH
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3 mb-1">
                      <div className={`h-3 rounded-full ${match.score >= 80 ? 'bg-green-500' : match.score >= 50 ? 'bg-yellow-400' : 'bg-red-400'}`} style={{ width: `${match.score}%` }}></div>
                    </div>
                    <p className="text-xs text-gray-400 font-medium mt-1">Relevancy Score</p>
                  </div>
                  
                  <button className="flex items-center justify-center p-4 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors h-14 w-14">
                     <ChevronRight className="w-6 h-6" />
                  </button>

                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SemanticSearch;
