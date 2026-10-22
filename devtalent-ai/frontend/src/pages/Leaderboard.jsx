import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Trophy, Medal, Star, TrendingUp, Award, Calendar } from 'lucide-react';

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const token = localStorage.getItem('devtalent_token');
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await axios.get(`${API_URL}/api/stats/leaderboard`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
          setLeaders(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load leaderboard', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLeaderboard();
  }, []);

  const getRankBadge = (rank) => {
    if (rank === 1) return <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center border-2 border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.5)]"><Trophy className="w-5 h-5 text-yellow-600" /></div>;
    if (rank === 2) return <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border-2 border-slate-300 shadow-md"><Medal className="w-5 h-5 text-slate-500" /></div>;
    if (rank === 3) return <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center border-2 border-orange-300 shadow-md"><Award className="w-5 h-5 text-orange-600" /></div>;
    return <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center border border-slate-200 text-slate-500 font-black">{rank}</div>;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-3xl p-10 text-white shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-20 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/2 group-hover:scale-125 transition-transform duration-1000"></div>
        <div className="absolute top-0 right-10 p-8 opacity-20 transform translate-x-4 -translate-y-4 group-hover:rotate-12 group-hover:scale-110 transition-all duration-700">
          <Trophy className="w-48 h-48" />
        </div>
        <div className="relative z-10 flex items-center gap-6">
          <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-md border border-white/30 shadow-lg">
            <Trophy className="w-12 h-12 text-yellow-200" />
          </div>
          <div>
            <h2 className="text-4xl font-black mb-2 tracking-tight drop-shadow-md">Global Leaderboard</h2>
            <p className="text-white/90 text-lg font-medium max-w-xl">
              The highest scoring algorithm submissions verified by DevTalent AI. Compete on optimization, complexity, and structural purity.
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
        </div>
      ) : leaders.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
          <Star className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-700">No Assessment Data Yet</h3>
          <p className="text-slate-500 mt-2">Take your first highly-optimized assessment to claim Rank #1!</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden relative z-10">
          <div className="grid grid-cols-12 gap-4 p-6 border-b border-slate-200 bg-slate-50/80 backdrop-blur-sm text-xs font-black text-slate-400 uppercase tracking-wider">
            <div className="col-span-2 text-center">Global Rank</div>
            <div className="col-span-4">Developer Profile</div>
            <div className="col-span-3">Assessment Verified</div>
            <div className="col-span-3 text-right pr-4">AI Purity Score</div>
          </div>
          
          <div className="divide-y divide-slate-100">
            {leaders.map((leader, idx) => (
              <div 
                key={idx} 
                className="grid grid-cols-12 gap-4 p-6 items-center hover:bg-slate-50 transition-colors duration-200 group"
              >
                <div className="col-span-2 flex justify-center transform group-hover:scale-110 group-hover:-translate-y-1 transition-all">
                  {getRankBadge(leader.rank)}
                </div>
                
                <div className="col-span-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 text-white flex items-center justify-center font-bold shadow-md shadow-amber-500/20">
                    {leader.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg">{leader.name}</h3>
                    <div className="flex items-center text-xs text-slate-500 mt-0.5">
                      <TrendingUp className="w-3 h-3 mr-1 text-emerald-500" />
                      Verified Candidate
                    </div>
                  </div>
                </div>

                <div className="col-span-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                    <Calendar className="w-3 h-3 mr-1.5" />
                    {leader.topic || 'General Evaluation'}
                  </span>
                </div>

                <div className="col-span-3 flex justify-end items-center pr-4">
                  <div className="text-right">
                    <div className={`text-2xl font-black ${leader.rank === 1 ? 'text-amber-500 drop-shadow-sm' : 'text-slate-700'}`}>
                      {leader.score}<span className="text-sm text-slate-400 ml-1">/100</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
