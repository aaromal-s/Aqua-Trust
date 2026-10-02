import { Link } from 'react-router-dom';
import { Droplets, Activity, Map, BarChart3, ShieldAlert, ArrowRight, ExternalLink } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-[#fafafa]">
      
      {/* Subtle Premium Illumination */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
      
      {/* Clean Masked Grid Background */}
      <div className="absolute inset-0 bg-grid-premium pointer-events-none z-0"></div>
      
      {/* 1. Telemetry Wave Animation */}
      <div className="absolute inset-x-0 top-1/3 h-[300px] pointer-events-none overflow-hidden z-0 opacity-20 mask-image:linear-gradient(to_bottom,white,transparent)">
        <div className="animate-wave flex h-full items-center">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="h-full w-full stroke-blue-400 fill-none" strokeWidth="1" strokeLinecap="round">
            <path d="M0,60 C150,120 300,0 450,60 C600,120 750,0 900,60 C1050,120 1200,60 1200,60" />
            <path d="M0,60 C150,120 300,0 450,60 C600,120 750,0 900,60 C1050,120 1200,60 1200,60" transform="translate(1200,0)" />
          </svg>
        </div>
      </div>

      {/* 3. Data Bubbles Animation */}
      <div className="absolute bottom-0 w-full h-[300px] pointer-events-none z-0 overflow-hidden">
        <div className="absolute bottom-[-10px] w-1.5 h-1.5 bg-blue-400/40 rounded-full bubble-1" />
        <div className="absolute bottom-[-10px] w-2 h-2 bg-indigo-400/30 rounded-full bubble-2" />
        <div className="absolute bottom-[-10px] w-1 h-1 bg-cyan-400/50 rounded-full bubble-3" />
        <div className="absolute bottom-[-10px] w-1.5 h-1.5 bg-blue-500/40 rounded-full bubble-4" />
        <div className="absolute bottom-[-10px] w-2 h-2 bg-blue-300/30 rounded-full bubble-5" />
      </div>
      
      {/* Navbar */}
      <nav className="w-full py-5 px-8 flex justify-between items-center z-10 header-panel animate-spring-up">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-[10px] bg-zinc-900 flex items-center justify-center shadow-md">
            <Droplets className="text-white w-5 h-5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-zinc-900">
            AquaTrust.
          </span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-500">
          <a href="#" className="hover:text-zinc-900 transition-colors">Platform</a>
          <a href="#" className="hover:text-zinc-900 transition-colors">Telemetry</a>
          <a href="#" className="hover:text-zinc-900 transition-colors">Analytics</a>
          <a href="#" className="hover:text-zinc-900 transition-colors">Customers</a>
        </div>
        
        <div className="flex items-center gap-5">
          <Link to="/login" className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors">
            Sign In
          </Link>
          <Link to="/dashboard" className="px-5 py-2.5 rounded-[10px] bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800 transition-all btn-premium flex items-center gap-2">
            Open Platform
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 z-10 py-24">
        
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-zinc-200 text-zinc-600 text-[11px] font-semibold tracking-widest uppercase mb-8 animate-spring-up delay-100 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          Hardware & Telemetry Engine 2.0
        </div>
        
        <h1 className="text-5xl md:text-[80px] font-bold tracking-tighter mb-6 max-w-5xl leading-[1.05] text-zinc-900 animate-spring-up delay-200">
          Water Intelligence. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-900 via-zinc-600 to-zinc-500">
            Engineered for Precision.
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-zinc-500 max-w-2xl mb-10 leading-relaxed font-medium animate-spring-up delay-300">
          The enterprise standard for real-time sensor telemetry, environmental compliance, and predictive water quality analytics.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 animate-spring-up delay-400">
          <Link to="/dashboard" className="w-full sm:w-auto px-8 py-3.5 rounded-[12px] bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 btn-premium">
            Explore Demo <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/reports" className="w-full sm:w-auto px-8 py-3.5 rounded-[12px] bg-white border border-zinc-200 text-zinc-700 text-sm font-medium hover:bg-zinc-50 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 btn-secondary">
            Documentation <ExternalLink className="w-4 h-4 text-zinc-400" />
          </Link>
        </div>

        {/* Hero Visual Mockup */}
        <div className="mt-24 w-full max-w-5xl relative animate-spring-up delay-500">
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-transparent to-transparent z-10 bottom-[-2px] h-[150%]" />
          
          <div className="card rounded-t-3xl p-4 md:p-10 border-b-0 flex flex-col md:flex-row gap-8 items-center justify-center relative overflow-hidden">
            {/* Subtle inner top glare */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-80" />
            
            {/* Visual Nodes */}
            <div className="flex flex-col items-center gap-4 z-20 relative group cursor-pointer">
              {/* 2. Sensor Sonar Ripple */}
              <div className="absolute inset-0 rounded-2xl border-blue-400/50 animate-ripple pointer-events-none hidden group-hover:block" />
              
              <div className="w-16 h-16 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-center justify-center btn-secondary relative z-10">
                <Activity className="w-6 h-6 text-zinc-700" />
              </div>
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Hardware</span>
            </div>
            
            <ArrowRight className="text-zinc-300 hidden md:block z-20" />
            
            <div className="flex flex-col items-center gap-4 z-20 relative group cursor-pointer">
              {/* 2. Sensor Sonar Ripple */}
              <div className="absolute inset-0 rounded-2xl border-indigo-400/50 animate-ripple pointer-events-none hidden group-hover:block" />
              
              <div className="w-16 h-16 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-center justify-center btn-secondary relative z-10">
                <Map className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Telemetry</span>
            </div>
            
            <ArrowRight className="text-zinc-300 hidden md:block z-20" />
            
            <div className="flex flex-col items-center gap-4 z-20 relative group cursor-pointer">
              {/* 2. Sensor Sonar Ripple */}
              <div className="absolute inset-0 rounded-2xl border-purple-400/50 animate-ripple pointer-events-none hidden group-hover:block" />
              
              <div className="w-16 h-16 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-center justify-center btn-secondary relative z-10">
                <BarChart3 className="w-6 h-6 text-indigo-600" />
              </div>
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Analytics</span>
            </div>
            
            <ArrowRight className="text-zinc-300 hidden md:block z-20" />
            
            <div className="flex flex-col items-center gap-4 relative z-20 group cursor-pointer">
              {/* 2. Sensor Sonar Ripple */}
              <div className="absolute inset-0 rounded-2xl border-red-400/50 animate-ripple pointer-events-none block" />
              
              <div className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-red-500 rounded-full animate-ping opacity-75 z-30" />
              <div className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white z-30" />
              <div className="w-16 h-16 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-center justify-center btn-secondary relative z-10">
                <ShieldAlert className="w-6 h-6 text-red-600" />
              </div>
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Response</span>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
