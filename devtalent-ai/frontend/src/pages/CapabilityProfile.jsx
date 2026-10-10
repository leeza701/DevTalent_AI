import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { User, Award, BookOpen, Briefcase, ChevronRight, Activity, MapPin, Mail, Loader2, Sparkles } from 'lucide-react';

function CapabilityProfile() {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('devtalent_token');
      const response = await axios.get('http://localhost:5000/api/resumes/me', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.data && response.data.data.length > 0) {
        // Grab the most recently parsed resume
        setProfile(response.data.data[0]);
      } else {
        setProfile(null);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load capability profile.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
        <p className="text-slate-500 font-medium">Generating Capability Profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-700 p-6 rounded-xl border border-red-100 flex items-center space-x-3">
        <Activity className="w-6 h-6" />
        <span className="font-semibold">{error}</span>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center max-w-2xl mx-auto mt-10">
        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Sparkles className="w-10 h-10 text-blue-500" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-4">No Profile Found</h2>
        <p className="text-slate-500 mb-8 leading-relaxed">
          You haven't generated a capability profile yet! Navigate to the Resumes tab and upload a standard PDF resume to let the AI automatically map out your skills and experience.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500">
      
      {/* Header Profile Section */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden relative">
        <div className="h-32 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"></div>
        <div className="px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-12 mb-6">
            <div className="flex items-end space-x-6">
              <div className="w-24 h-24 bg-white p-1.5 rounded-2xl shadow-md border border-slate-100">
                <div className="w-full h-full bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl flex items-center justify-center">
                  <User className="w-10 h-10 text-indigo-400" />
                </div>
              </div>
              <div className="pb-1">
                <h1 className="text-3xl font-bold text-slate-900">{user?.name}</h1>
                <p className="text-indigo-600 font-medium tracking-wide">AI-Extracted Capability Rank</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 bg-emerald-50 px-4 py-2 rounded-lg border border-emerald-100">
              <Activity className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-bold text-emerald-700">Verified Profile</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-6 text-slate-500 text-sm">
            <div className="flex items-center">
              <Mail className="w-4 h-4 mr-2" />
              {user?.email}
            </div>
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              Remote
            </div>
            <div className="flex items-center bg-slate-100 px-3 py-1 rounded-full text-slate-600 font-medium">
              Source: {profile.fileName}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (Skills) */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Award className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">Core Technologies</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.skills && profile.skills.map((skill, index) => (
                <span 
                  key={index} 
                  className="px-4 py-2 bg-slate-50 border border-slate-100 text-slate-700 rounded-xl font-medium text-sm hover:shadow-md hover:border-blue-200 hover:text-blue-700 transition-all cursor-default"
                >
                  {skill}
                </span>
              ))}
              {(!profile.skills || profile.skills.length === 0) && (
                <p className="text-sm text-slate-400">No specific technologies mapped.</p>
              )}
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-3xl shadow-lg p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-700">
              <Sparkles className="w-32 h-32 text-indigo-300" />
            </div>
            <div className="relative z-10">
              <h3 className="text-xl font-bold text-white mb-3">Take Assessment</h3>
              <p className="text-indigo-200 text-sm leading-relaxed mb-6">
                Validate your parsed skills with our AI-driven code simulations to stand out to elite recruiters.
              </p>
              <button className="w-full bg-white text-indigo-900 py-3 rounded-xl font-bold hover:bg-indigo-50 shadow-lg transition-all">
                Unlock Phase 9
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (Experience & Ed) */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
            <div className="flex items-center space-x-3 mb-8">
              <div className="p-2 bg-purple-50 rounded-lg">
                <Briefcase className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">Professional Experience</h3>
            </div>
            
            <div className="space-y-8 pl-4 border-l-2 border-slate-100 ml-4 relative">
              {profile.experience && profile.experience.length > 0 ? profile.experience.map((exp, index) => (
                <div key={index} className="relative">
                  <div className="absolute -left-[29px] top-1 w-4 h-4 bg-white border-2 border-purple-400 rounded-full"></div>
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 hover:shadow-md transition-shadow">
                    <h4 className="text-lg font-bold text-slate-900">{exp.title}</h4>
                    <p className="text-purple-600 font-medium mb-2">{exp.company}</p>
                    <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 bg-white px-3 py-1 rounded-md border border-slate-200 w-max">
                      <Activity className="w-3 h-3" />
                      <span>{exp.years}</span>
                    </div>
                  </div>
                </div>
              )) : (
                <p className="text-sm text-slate-400">No experience records mapped.</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-emerald-50 rounded-lg">
                <BookOpen className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">Education Details</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profile.education && profile.education.length > 0 ? profile.education.map((ed, index) => (
                <div key={index} className="flex items-center space-x-4 bg-slate-50 border border-slate-100 rounded-2xl p-5 hover:border-emerald-200 transition-colors">
                  <div className="h-10 w-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-5 h-5 text-emerald-700" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 leading-tight">{ed.degree}</h4>
                    <p className="text-sm text-slate-500">{ed.institution}</p>
                    <p className="text-xs font-semibold text-emerald-600 mt-1">{ed.year}</p>
                  </div>
                </div>
              )) : (
                <p className="text-sm text-slate-400">No educational background mapped.</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default CapabilityProfile;
