import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Droplets, ArrowRight } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col justify-center items-center relative overflow-hidden py-12">
      <div className="absolute top-0 right-1/2 translate-x-1/2 w-[800px] h-[500px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />
      
      <Link to="/" className="flex items-center gap-3 mb-8 z-10 hover:opacity-80 transition-opacity">
        <div className="w-10 h-10 rounded-[10px] bg-zinc-900 flex items-center justify-center shadow-md">
          <Droplets className="text-white w-6 h-6" />
        </div>
        <span className="text-2xl font-bold tracking-tight text-zinc-900">AquaTrust.</span>
      </Link>

      <div className="card w-full max-w-lg bg-white/70 backdrop-blur-xl p-8 rounded-3xl border border-zinc-200 shadow-xl z-10">
        <h2 className="text-2xl font-bold text-zinc-900 mb-2">Citizen Registration</h2>
        <p className="text-zinc-500 mb-8 font-medium">Create an account to monitor your local water system.</p>

        <form onSubmit={handleRegister} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-1.5">First Name</label>
              <input type="text" required className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-shadow" placeholder="John" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Last Name</label>
              <input type="text" required className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-shadow" placeholder="Doe" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Email Address</label>
            <input type="email" required className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-shadow" placeholder="john@example.com" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-1.5">System ID (Optional)</label>
            <input type="text" className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-shadow" placeholder="e.g. AQ-RES-942" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Password</label>
            <input type="password" required className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-shadow" placeholder="••••••••" />
          </div>
          
          <button type="submit" className="w-full btn-premium py-3.5 bg-zinc-900 text-white font-semibold rounded-xl mt-4 flex justify-center items-center gap-2">
            Create Account <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>

      <p className="mt-8 text-sm font-medium text-zinc-500 z-10">
        Already have an account? <Link to="/login" className="text-zinc-900 font-bold hover:underline">Sign In</Link>
      </p>
    </div>
  );
};

export default Register;
