import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UploadCloud, FileText, CheckCircle } from 'lucide-react';

const Resumes = () => {
  const [file, setFile] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/resumes/me`);
      setResumes(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(null);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('resume', file);

    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/resumes/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResumes([res.data.data, ...resumes]);
      setFile(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900 rounded-3xl shadow-xl overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 opacity-20 rounded-full blur-[80px]"></div>
        
        <div className="p-8 relative z-10 border-b border-indigo-800/50">
          <h2 className="text-3xl font-black text-white tracking-tight drop-shadow-md mb-2">Resume Parsing</h2>
          <p className="text-indigo-200">Our AI will automatically map out your skills and experience from your resume.</p>
        </div>
        
        <div className="p-8 relative z-10 bg-white/5 backdrop-blur-md">
          <form onSubmit={handleUpload} className="space-y-6">
            <div className="border-2 border-dashed border-indigo-400/50 hover:border-indigo-400 rounded-3xl p-10 flex flex-col items-center justify-center bg-white/5 hover:bg-white/10 transition-all duration-300 group shadow-inner">
              <UploadCloud className="w-16 h-16 text-indigo-400 group-hover:text-indigo-300 mb-4 transform group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-300 drop-shadow-lg" />
              <input 
                type="file" 
                accept=".pdf"
                onChange={handleFileChange}
                className="mb-4 text-sm text-indigo-300 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer shadow-lg file:shadow-indigo-500/30"
              />
              <p className="text-xs font-black uppercase tracking-widest text-indigo-400/70">.PDF Files Only</p>
            </div>
            {error && <p className="text-red-400 text-sm font-bold bg-red-900/40 p-3 rounded-lg border border-red-500/50 text-center">{error}</p>}
            <button 
              type="submit" 
              disabled={!file || loading}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-black uppercase tracking-widest py-4 md:py-5 rounded-2xl hover:from-indigo-400 hover:to-purple-500 shadow-[0_0_20px_rgba(99,102,241,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1"
            >
              {loading ? <span className="flex items-center justify-center"><UploadCloud className="w-5 h-5 mr-2 animate-bounce" /> Parsing Resume...</span> : 'Upload & Parse'}
            </button>
          </form>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden relative border border-slate-100 p-8">
        <h2 className="text-2xl font-black text-slate-800 mb-6 drop-shadow-sm flex items-center">
          <FileText className="w-6 h-6 mr-3 text-indigo-500" /> Uploaded Resumes
        </h2>
        {resumes.length === 0 ? (
          <p className="text-slate-400 font-bold text-center py-10">No resumes uploaded yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map((resume) => (
              <div key={resume._id} className="border border-slate-200 bg-slate-50 hover:bg-white border-b-4 hover:border-b-indigo-500 rounded-2xl p-6 hover:shadow-[0_10px_30px_rgba(99,102,241,0.1)] transition-all duration-300 group">
                <div className="flex items-center mb-6 border-b border-slate-200 pb-4">
                  <div className="bg-indigo-100 p-3 rounded-xl mr-4 group-hover:scale-110 transition-transform">
                    <FileText className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h3 className="font-black text-slate-800 text-lg truncate" title={resume.fileName}>{resume.fileName.replace('.pdf', '')}</h3>
                </div>
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center group-hover:text-indigo-400 transition-colors">
                    Extracted Skills <CheckCircle className="w-3 h-3 ml-1" />
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {resume.skills?.length > 0 ? resume.skills.slice(0, 10).map((skill, index) => (
                      <span key={index} className="bg-white border border-slate-200 shadow-sm text-slate-600 px-3 py-1 rounded-lg text-xs font-bold">
                        {skill}
                      </span>
                    )) : (
                      <span className="text-xs text-slate-400 font-medium italic">Pending extraction...</span>
                    )}
                    {resume.skills?.length > 10 && (
                      <span className="bg-slate-200 text-slate-600 px-3 py-1 rounded-lg text-xs font-bold border border-slate-300 shadow-inner">
                        +{resume.skills.length - 10} more
                      </span>
                    )}
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

export default Resumes;
