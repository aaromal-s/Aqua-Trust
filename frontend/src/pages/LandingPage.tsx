import { Link } from 'react-router-dom';
import { Droplets, Activity, Map, BarChart3, ShieldAlert, ArrowRight } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-[var(--background)]">
      {/* Dynamic Water-like Background Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-aqua-500/15 blur-[120px] pointer-events-none animate-blob" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-600/15 blur-[120px] pointer-events-none animate-blob" style={{ animationDelay: '5s' }} />
      <div className="absolute top-[30%] left-[30%] w-[40%] h-[40%] rounded-full bg-cyan-400/10 blur-[120px] pointer-events-none animate-blob" style={{ animationDelay: '10s' }} />
      
      {/* Overlay to give it a slightly shimmering underwater feel */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] opacity-20 mix-blend-overlay pointer-events-none"></div>
      
      {/* Navbar */}
      <nav className="w-full py-6 px-8 flex justify-between items-center z-10 glass-panel border-x-0 border-t-0 border-b-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-aqua-400 to-blue-600 flex items-center justify-center shadow-lg shadow-aqua-500/20">
            <Droplets className="text-slate-900 w-6 h-6" />
          </div>
          <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            AQUA TRUST
          </span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <a href="#" className="hover:text-slate-900 transition-colors">Platform</a>
          <a href="#" className="hover:text-slate-900 transition-colors">Monitoring</a>
          <a href="#" className="hover:text-slate-900 transition-colors">Analytics</a>
          <a href="#" className="hover:text-slate-900 transition-colors">Water Map</a>
        </div>
        
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors px-4 py-2">
            Sign In
          </Link>
          <Link to="/dashboard" className="px-5 py-2.5 rounded-full bg-gradient-to-r from-aqua-500 to-blue-600 text-slate-900 text-sm font-semibold hover:shadow-lg hover:shadow-aqua-500/25 transition-all flex items-center gap-2">
            Get Started <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 z-10 py-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-aqua-500/10 border border-aqua-500/20 text-aqua-400 text-xs font-semibold uppercase tracking-wider mb-8">
          <span className="w-2 h-2 rounded-full bg-aqua-400 animate-pulse" />
          Intelligent Water Monitoring
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 max-w-4xl leading-tight">
          Intelligent Water Monitoring.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-aqua-400 via-blue-500 to-purple-500">
            Built for a Safer Future.
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-500 max-w-2xl mb-10 leading-relaxed">
          Monitor water quality in real time, understand environmental changes, detect anomalies, and transform sensor data into actionable water intelligence.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link to="/dashboard" className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-white text-base font-bold hover:bg-gray-100 transition-all flex items-center justify-center gap-2">
            Explore Live Monitoring
          </Link>
          <Link to="/intelligence" className="w-full sm:w-auto px-8 py-4 rounded-full glass-panel text-slate-900 text-base font-semibold hover:bg-slate-900/10 transition-all flex items-center justify-center gap-2">
            View Water Intelligence
          </Link>
        </div>

        {/* Hero Visual Mockup */}
        <div className="mt-20 w-full max-w-5xl relative">
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] to-transparent z-10 bottom-[-2px]" />
          <div className="glass-panel rounded-t-2xl p-4 md:p-8 border-b-0 flex flex-col md:flex-row gap-6 items-center justify-center">
            
            {/* Visual Nodes */}
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-card border border-slate-900/10 flex items-center justify-center shadow-lg">
                <Activity className="w-8 h-8 text-blue-400" />
              </div>
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Sensors</span>
            </div>
            
            <ArrowRight className="text-gray-600 hidden md:block" />
            <div className="h-8 w-[1px] bg-gray-600 md:hidden" />
            
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-card border border-slate-900/10 flex items-center justify-center shadow-lg">
                <Map className="w-8 h-8 text-aqua-400" />
              </div>
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Map</span>
            </div>
            
            <ArrowRight className="text-gray-600 hidden md:block" />
            <div className="h-8 w-[1px] bg-gray-600 md:hidden" />
            
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-card border border-slate-900/10 flex items-center justify-center shadow-lg">
                <BarChart3 className="w-8 h-8 text-purple-400" />
              </div>
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Analytics</span>
            </div>
            
            <ArrowRight className="text-gray-600 hidden md:block" />
            <div className="h-8 w-[1px] bg-gray-600 md:hidden" />
            
            <div className="flex flex-col items-center gap-3 relative">
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
              <div className="w-16 h-16 rounded-2xl bg-card border border-slate-900/10 flex items-center justify-center shadow-lg">
                <ShieldAlert className="w-8 h-8 text-red-400" />
              </div>
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Alerts</span>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
