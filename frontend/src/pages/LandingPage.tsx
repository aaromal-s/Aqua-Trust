import { Link } from 'react-router-dom';
import { Droplets, Activity, Map, BarChart3, ShieldAlert, ArrowRight, ExternalLink } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-[var(--background)]">
      {/* Clean Grid Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none"></div>
      
      {/* Navbar */}
      <nav className="w-full py-5 px-8 flex justify-between items-center z-10 header-panel animate-fade-in-up">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm">
            <Droplets className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            Aqua Trust
          </span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500">
          <a href="#" className="hover:text-slate-900 transition-colors">Platform</a>
          <a href="#" className="hover:text-slate-900 transition-colors">Monitoring</a>
          <a href="#" className="hover:text-slate-900 transition-colors">Analytics</a>
          <a href="#" className="hover:text-slate-900 transition-colors">Documentation</a>
        </div>
        
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors px-3 py-2">
            Sign In
          </Link>
          <Link to="/dashboard" className="px-5 py-2.5 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-all shadow-sm hover:shadow-md flex items-center gap-2">
            Open Dashboard
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 z-10 py-24">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-xs font-semibold mb-8 animate-fade-in-up delay-100 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          Platform v2.0 is now live
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 max-w-4xl leading-tight text-slate-900 animate-fade-in-up delay-200">
          Professional Water Data.<br />
          <span className="text-blue-600">
            Simplified.
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-500 max-w-2xl mb-10 leading-relaxed animate-fade-in-up delay-300">
          The all-in-one platform to monitor real-time sensor telemetry, track environmental compliance, and instantly analyze water quality trends.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
          <Link to="/dashboard" className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-blue-600 text-white text-base font-medium hover:bg-blue-700 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md">
            View Live Demo <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/reports" className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-white border border-slate-200 text-slate-700 text-base font-medium hover:bg-slate-50 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 shadow-sm">
            Read Documentation <ExternalLink className="w-4 h-4" />
          </Link>
        </div>

        {/* Hero Visual Mockup */}
        <div className="mt-20 w-full max-w-4xl relative animate-fade-in-up" style={{ animationDelay: '500ms' }}>
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] to-transparent z-10 bottom-[-2px]" />
          <div className="card rounded-t-2xl p-4 md:p-8 border-b-0 flex flex-col md:flex-row gap-6 items-center justify-center shadow-lg bg-white/50 backdrop-blur-sm">
            
            {/* Visual Nodes */}
            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                <Activity className="w-6 h-6 text-slate-700" />
              </div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Hardware</span>
            </div>
            
            <ArrowRight className="text-slate-300 hidden md:block" />
            <div className="h-8 w-[1px] bg-slate-200 md:hidden" />
            
            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                <Map className="w-6 h-6 text-blue-500" />
              </div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Telemetry</span>
            </div>
            
            <ArrowRight className="text-slate-300 hidden md:block" />
            <div className="h-8 w-[1px] bg-slate-200 md:hidden" />
            
            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                <BarChart3 className="w-6 h-6 text-indigo-500" />
              </div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Analytics</span>
            </div>
            
            <ArrowRight className="text-slate-300 hidden md:block" />
            <div className="h-8 w-[1px] bg-slate-200 md:hidden" />
            
            <div className="flex flex-col items-center gap-3 relative">
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
              <div className="w-14 h-14 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                <ShieldAlert className="w-6 h-6 text-red-500" />
              </div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Action</span>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
