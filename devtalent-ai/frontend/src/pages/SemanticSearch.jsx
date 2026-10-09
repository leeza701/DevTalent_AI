import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Briefcase, ChevronRight, Award, MapPin, User, ChevronDown } from 'lucide-react';

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
        const res = await axios.get('http://localhost:5000/api/jobs', {
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
      const res = await axios.get(`http://localhost:5000/api/matches/${selectedJob}`, {
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
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8">
        <div className="flex items-center mb-6">
          <div className="bg-blue-100 p-3 rounded-xl mr-4">
            <Search className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Semantic Matching Engine</h2>
            <p className="text-gray-500 mt-1">Select a Target Job Requisition to instantly rank all parsed candidates.</p>
          </div>
        </div>
        
        <form onSubmit={handleSearch} className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Target Job</label>
            <div className="relative">
              <select
                value={selectedJob}
                onChange={(e) => setSelectedJob(e.target.value)}
                className="w-full appearance-none px-4 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 font-medium cursor-pointer"
              >
                <option value="" disabled>-- Select a Job to Analyze --</option>
                {jobs.map(job => (
                  <option key={job._id} value={job._id}>{job.title} - {job.company}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                <ChevronDown className="w-5 h-5" />
              </div>
            </div>
          </div>
          <button
            type="submit"
            disabled={!selectedJob || loading}
            className="h-[58px] px-8 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-md disabled:bg-gray-300 disabled:cursor-not-allowed transition-all flex items-center"
          >
            {loading ? 'Matching...' : 'Run Analysis'}
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
