import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to login. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600 opacity-20 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600 opacity-20 rounded-full blur-[120px]"></div>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>

      <div className="max-w-md w-full space-y-8 bg-white/10 backdrop-blur-3xl p-10 rounded-[2.5rem] shadow-2xl border border-white/20 relative z-10 group hover:shadow-[0_0_50px_rgba(99,102,241,0.2)] transition-shadow duration-700">
        <div>
          <h2 className="mt-2 text-center text-4xl font-black bg-gradient-to-r from-indigo-300 via-white to-purple-300 bg-clip-text text-transparent drop-shadow-md">
            DevTalent AI
          </h2>
          <p className="mt-3 text-center text-sm font-bold tracking-widest uppercase text-indigo-300">
            Welcome Back
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <div className="text-red-300 text-sm text-center font-bold bg-red-900/40 border border-red-500/50 p-4 rounded-2xl">{error}</div>}
          <div className="space-y-5">
            <div className="group/input">
              <label className="text-xs font-black tracking-widest uppercase text-slate-400 group-hover/input:text-indigo-300 transition-colors ml-1">Email Address</label>
              <input
                type="email"
                required
                className="mt-2 appearance-none relative block w-full px-5 py-4 border border-white/10 bg-white/5 text-white placeholder-slate-500 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-400 sm:text-sm transition-all shadow-inner font-semibold"
                placeholder="developer@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="group/input">
              <label className="text-xs font-black tracking-widest uppercase text-slate-400 group-hover/input:text-indigo-300 transition-colors ml-1">Password</label>
              <input
                type="password"
                required
                className="mt-2 appearance-none relative block w-full px-5 py-4 border border-white/10 bg-white/5 text-white placeholder-slate-500 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-400 sm:text-sm transition-all shadow-inner font-bold tracking-widest"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-black tracking-widest uppercase rounded-2xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-[0_0_25px_rgba(99,102,241,0.5)] transform transition-all duration-300 hover:-translate-y-1"
            >
              Sign In
            </button>
          </div>
        </form>
        <div className="text-center mt-6">
          <p className="text-sm font-bold text-slate-400">
            Don't have an account? <Link to="/register" className="font-black text-indigo-400 hover:text-indigo-300 uppercase tracking-widest ml-2">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
