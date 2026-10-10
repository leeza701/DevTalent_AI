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
      const res = await axios.get(`\${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/resumes/me`);
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
      const res = await axios.post(`\${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/resumes/upload`, formData, {
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
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Resume Parsing</h2>
        <form onSubmit={handleUpload} className="space-y-4">
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center hover:bg-slate-50 transition-colors">
            <UploadCloud className="w-12 h-12 text-slate-400 mb-4" />
            <input 
              type="file" 
              accept=".pdf"
              onChange={handleFileChange}
              className="mb-4 text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <p className="text-sm text-slate-500">Only PDF files are supported</p>
          </div>
          {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
          <button 
            type="submit" 
            disabled={!file || loading}
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors disabled:bg-slate-300"
          >
            {loading ? 'Extracting with AI...' : 'Upload & Parse Resume'}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">My Parsed Resumes</h2>
        {resumes.length === 0 ? (
          <p className="text-slate-500">No resumes uploaded yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {resumes.map((resume) => (
              <div key={resume._id} className="border border-slate-200 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <FileText className="w-6 h-6 text-blue-500 mr-3" />
                  <h3 className="font-bold text-slate-800">{resume.fileName}</h3>
                </div>
                <div className="mb-4">
                  <h4 className="text-sm font-bold text-slate-500 mb-2">Identified Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {resume.skills?.map((skill, index) => (
                      <span key={index} className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs font-medium flex items-center">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        {skill}
                      </span>
                    ))}
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
