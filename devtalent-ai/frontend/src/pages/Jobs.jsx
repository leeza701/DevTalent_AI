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
      const res = await axios.get(`\${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/jobs`, {
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
        `\${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/jobs`,
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
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Job Requisition</h2>
        
        {error && <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-lg">{error}</div>}
        {success && <div className="mb-4 p-4 text-green-700 bg-green-100 rounded-lg">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="e.g. Senior Frontend Engineer"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="e.g. DevTalent Labs"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Job Description</label>
            <textarea
              required
              rows="6"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Paste the raw job description here..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 text-white font-semibold rounded-xl transition-all duration-300 bg-blue-600 hover:bg-blue-700 hover:shadow-lg disabled:opacity-70 flex justify-center items-center"
          >
            {loading ? (
              <span className="flex items-center space-x-2">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Extracting AI Requirements...</span>
              </span>
            ) : (
              'Parse & Save Job'
            )}
          </button>
        </form>
      </div>

      {/* Display Section */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Active Job Requisitions</h2>
        
        {jobs.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No jobs created yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {jobs.map((job) => (
              <div key={job._id} className="p-6 rounded-2xl border border-gray-100 hover:shadow-lg hover:border-blue-100 bg-slate-50 transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                    <p className="text-gray-500 font-medium">{job.company}</p>
                  </div>
                  <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">
                    Active
                  </span>
                </div>
                
                <div className="space-y-4">
                  {/* AI Requirements */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2 border-b pb-1">AI Extracted Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {job.requirements?.skills?.map((skill, index) => (
                        <span key={index} className="bg-white border border-gray-200 text-gray-700 px-3 py-1 rounded-lg text-sm shadow-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-3 rounded-lg border border-gray-100">
                      <p className="text-xs text-gray-500 mb-1 font-semibold uppercase">Min Experience</p>
                      <p className="font-bold text-gray-800">{job.requirements?.minYearsExperience} Years</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-gray-100">
                      <p className="text-xs text-gray-500 mb-1 font-semibold uppercase">Education</p>
                      <p className="font-medium text-gray-800 text-sm">{job.requirements?.education}</p>
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
