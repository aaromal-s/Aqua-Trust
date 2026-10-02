import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Droplets, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { toggleRole } = useAuth();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col justify-center items-center relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />
      
      <Link to="/" className="flex items-center gap-3 mb-8 z-10 hover:opacity-80 transition-opacity">
        <div className="w-10 h-10 rounded-[10px] bg-zinc-900 flex items-center justify-center shadow-md">
          <Droplets className="text-white w-6 h-6" />
        </div>
        <span className="text-2xl font-bold tracking-tight text-zinc-900">AquaTrust.</span>
      </Link>

      <div className="card w-full max-w-md bg-white/70 backdrop-blur-xl p-8 rounded-3xl border border-zinc-200 shadow-xl z-10">
        <h2 className="text-2xl font-bold text-zinc-900 mb-2">Welcome back</h2>
        <p className="text-zinc-500 mb-8 font-medium">Enter your credentials to access the platform.</p>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Email Address</label>
            <input type="email" required className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-shadow" placeholder="admin@aquatrust.gov" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Password</label>
            <input type="password" required className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-shadow" placeholder="••••••••" />
          </div>
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-zinc-600 font-medium cursor-pointer">
              <input type="checkbox" className="rounded border-zinc-300" /> Remember me
            </label>
            <a href="#" className="text-zinc-900 font-bold hover:underline">Forgot password?</a>
          </div>
          
          <button type="submit" className="w-full btn-premium py-3.5 bg-zinc-900 text-white font-semibold rounded-xl mt-4 flex justify-center items-center gap-2">
            Sign In <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-zinc-200/60 text-center">
          <p className="text-sm font-medium text-zinc-500 mb-4">Mock Options for Testing:</p>
          <button onClick={() => { toggleRole(); navigate('/dashboard'); }} className="w-full btn-secondary py-2.5 text-sm font-semibold rounded-xl border border-zinc-200 text-zinc-700">
            Login as alternate role
          </button>
        </div>
      </div>

      <p className="mt-8 text-sm font-medium text-zinc-500 z-10">
        Don't have an account? <Link to="/register" className="text-zinc-900 font-bold hover:underline">Register as Citizen</Link>
      </p>
    </div>
  );
};

export default Login;
