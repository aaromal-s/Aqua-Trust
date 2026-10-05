import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Droplets, Map, BarChart3, ShieldAlert, ArrowRight, Stethoscope, Award, HeartHandshake, Users, Check, Sparkles, MessageSquare } from 'lucide-react';
import LocalitySafetyChecker from '../components/LocalitySafetyChecker';
import WaterComparisonScrubber from '../components/WaterComparisonScrubber';
import WaterIQChallenge from '../components/WaterIQChallenge';
import LiveCommunityTicker from '../components/LiveCommunityTicker';
import SensorNodeExplorer from '../components/SensorNodeExplorer';

const communityGuardians = [
  { name: 'Dr. Harpreet Kaur', role: 'Punjab Water Resources Limnologist', points: '1,420 pts', badge: 'Master Hydrologist', reports: 34 },
  { name: 'Gurjit Singh Dhillon', role: 'Sector 35-B Chandigarh RWA Lead', points: '1,180 pts', badge: 'Tricity Guardian', reports: 28 },
  { name: 'Simranpreet Ahluwalia', role: 'PAU Ludhiana Eco-Club Volunteer', points: '940 pts', badge: 'Stream Protector', reports: 19 },
];

const waterBodiesToAdopt = [
  { name: 'Sukhna Lake Wetland Reserve (Sector 1, Chandigarh)', stewards: '42 Active Stewards', status: 'Optimal Health (BIS Compliant)', healthScore: '94%' },
  { name: 'Kajauli Waterworks Bhakra Feeder (Sector 39 Grid)', stewards: '28 Active Stewards', status: 'Continuous Supply Monitored', healthScore: '91%' },
  { name: 'Harike Pattan Wetland (Sutlej-Beas Confluence)', stewards: '35 Active Stewards', status: 'Bio-Filter Sanctuary', healthScore: '86%' },
  { name: 'Budha Nullah Clean Stream Initiative (Ludhiana)', stewards: '56 Active Stewards', status: 'Active Bioremediation Watch', healthScore: '54%' },
];

export const LandingPage = () => {
  const [adoptedBodies, setAdoptedBodies] = useState<string[]>([]);

  const toggleAdopt = (name: string) => {
    if (adoptedBodies.includes(name)) {
      setAdoptedBodies(adoptedBodies.filter(b => b !== name));
    } else {
      setAdoptedBodies([...adoptedBodies, name]);
    }
  };

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

      {/* 2. Data Bubbles Animation */}
      <div className="absolute bottom-0 w-full h-[300px] pointer-events-none z-0 overflow-hidden">
        <div className="absolute bottom-[-10px] w-1.5 h-1.5 bg-blue-400/40 rounded-full bubble-1" />
        <div className="absolute bottom-[-10px] w-2 h-2 bg-indigo-400/30 rounded-full bubble-2" />
        <div className="absolute bottom-[-10px] w-1 h-1 bg-cyan-400/50 rounded-full bubble-3" />
        <div className="absolute bottom-[-10px] w-1.5 h-1.5 bg-blue-500/40 rounded-full bubble-4" />
        <div className="absolute bottom-[-10px] w-2 h-2 bg-blue-300/30 rounded-full bubble-5" />
      </div>
      
      {/* Navbar */}
      <nav className="w-full py-5 px-6 md:px-8 flex justify-between items-center z-10 header-panel animate-spring-up">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-[10px] bg-zinc-900 flex items-center justify-center shadow-md">
            <Droplets className="text-white w-5 h-5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-zinc-900">
            AquaTrust.
          </span>
        </div>
        
        <div className="hidden lg:flex items-center gap-7 text-sm font-medium text-zinc-600">
          <a href="#safety-checker" className="hover:text-blue-600 transition-colors flex items-center gap-1 font-semibold text-blue-600">
            <Droplets className="w-3.5 h-3.5" /> Check My Water
          </a>
          <a href="#visual-scrubber" className="hover:text-zinc-900 transition-colors">Visual Scrubber</a>
          <a href="#water-iq" className="hover:text-zinc-900 transition-colors">Water IQ Quiz</a>
          <Link to="/doctor" className="hover:text-zinc-900 transition-colors flex items-center gap-1">
            <Stethoscope className="w-3.5 h-3.5 text-blue-500" /> Aqua Doctor
          </Link>
          <Link to="/reporting" className="hover:text-zinc-900 transition-colors flex items-center gap-1">
            <MessageSquare className="w-3.5 h-3.5 text-emerald-500" /> Report Hazard
          </Link>
          <Link to="/dashboard" className="hover:text-zinc-900 transition-colors">Live Map</Link>
        </div>
        
        <div className="flex items-center gap-3 md:gap-4">
          <Link to="/login" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors">
            Sign In
          </Link>
          <Link to="/dashboard" className="px-4 py-2 rounded-xl bg-zinc-900 text-white text-xs font-semibold hover:bg-zinc-800 transition-all btn-premium flex items-center gap-1.5 shadow-sm">
            Launch Platform <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 z-10 pt-16 pb-12">
        
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-zinc-200 text-zinc-700 text-[11px] font-semibold tracking-widest uppercase mb-6 animate-spring-up delay-100 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          Interactive Hydrology & Community Intelligence
        </div>
        
        <h1 className="text-4xl sm:text-5xl md:text-[76px] font-bold tracking-tighter mb-6 max-w-5xl leading-[1.05] text-zinc-900 animate-spring-up delay-200">
          Clean Water Trust. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-zinc-800">
            Transparent for Every Citizen.
          </span>
        </h1>
        
        <p className="text-base md:text-xl text-zinc-600 max-w-2xl mb-8 leading-relaxed font-medium animate-spring-up delay-300">
          Transforming complex municipal hydrology into plain-English health guidance, interactive tap diagnostics, and community-driven pollution response.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 animate-spring-up delay-400 mb-8">
          <a href="#safety-checker" className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 shadow-md shadow-blue-500/20">
            <Droplets className="w-4 h-4" /> Check My Tap Water Now
          </a>
          <Link to="/doctor" className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white border border-zinc-200 text-zinc-800 text-sm font-semibold hover:bg-zinc-50 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 shadow-sm">
            <Stethoscope className="w-4 h-4 text-blue-600" /> Diagnose Water Symptom
          </Link>
        </div>

        {/* 1. Live Community Impact Ticker & Odometer */}
        <LiveCommunityTicker />

        {/* 2. Feature: Locality / Pincode Drinkability Checker Widget */}
        <div id="safety-checker" className="w-full px-4 scroll-mt-24">
          <LocalitySafetyChecker />
        </div>

        {/* 3. Interactive Split Scrubber (Clean vs. Contaminated) */}
        <div id="visual-scrubber" className="w-full px-4 scroll-mt-24">
          <WaterComparisonScrubber />
        </div>

        {/* 4. Gamified 15-Second Water IQ Challenge */}
        <div id="water-iq" className="w-full px-4 scroll-mt-24">
          <WaterIQChallenge />
        </div>

        {/* 5. 3D IoT Hardware Telemetry Node Explorer */}
        <div className="w-full px-4">
          <SensorNodeExplorer />
        </div>

        {/* 6. Feature: Community Water Guardians & Adopt A Water Body */}
        <div className="mt-20 w-full max-w-5xl px-4 text-left">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md mb-2">
                <Award className="w-3.5 h-3.5" /> Community Gamification & Stewardship
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-zinc-900">Community Water Guardians</h3>
              <p className="text-xs text-zinc-500">Everyday citizens and students earning Eco-Points by verifying water purity and protecting local reservoirs.</p>
            </div>

            <Link to="/reporting" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 self-start md:self-auto shadow-sm">
              <Sparkles className="w-3.5 h-3.5" /> Earn Eco-Points
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Guardian Leaderboard */}
            <div className="card !p-6 bg-white border border-zinc-200 rounded-2xl shadow-sm space-y-4">
              <h4 className="text-sm font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" /> Top Community Stewards
              </h4>

              <div className="space-y-3">
                {communityGuardians.map((guardian, i) => (
                  <div key={guardian.name} className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 border border-zinc-100">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
                        #{i + 1}
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-zinc-900">{guardian.name}</h5>
                        <span className="text-[10px] text-zinc-500">{guardian.role} • {guardian.reports} reports</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-emerald-600 block">{guardian.points}</span>
                      <span className="text-[10px] text-zinc-400 bg-white px-2 py-0.5 rounded border border-zinc-200 font-medium">
                        {guardian.badge}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Adopt a Water Body Program */}
            <div className="card !p-6 bg-white border border-zinc-200 rounded-2xl shadow-sm space-y-4">
              <h4 className="text-sm font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-emerald-600" /> Adopt a Local Water Body
              </h4>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Pledge to watch over a specific lake, river bend, or stream in your town. Get direct notifications whenever telemetry shifts or pollution is reported.
              </p>

              <div className="space-y-2.5">
                {waterBodiesToAdopt.map((item) => {
                  const isAdopted = adoptedBodies.includes(item.name);
                  return (
                    <div key={item.name} className="flex items-center justify-between p-3 rounded-xl border border-zinc-200 hover:border-emerald-300 transition-colors">
                      <div>
                        <h5 className="text-xs font-bold text-zinc-800">{item.name}</h5>
                        <span className="text-[10px] text-zinc-500">{item.stewards} • Health: <strong className="text-emerald-600">{item.healthScore}</strong></span>
                      </div>

                      <button
                        onClick={() => toggleAdopt(item.name)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                          isAdopted
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-zinc-100 hover:bg-emerald-50 text-zinc-700 hover:text-emerald-700'
                        }`}
                      >
                        {isAdopted ? <Check className="w-3.5 h-3.5" /> : null}
                        {isAdopted ? 'Pledged' : 'Adopt Stream'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

        {/* Hero Visual Mockup */}
        <div className="mt-16 w-full max-w-5xl relative animate-spring-up delay-500">
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-transparent to-transparent z-10 bottom-[-2px] h-[150%]" />
          
          <div className="card rounded-t-3xl p-4 md:p-10 border-b-0 flex flex-col md:flex-row gap-8 items-center justify-center relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-80" />
            
            {/* Visual Nodes */}
            <div className="flex flex-col items-center gap-4 z-20 relative group cursor-pointer">
              <div className="w-16 h-16 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-center justify-center btn-secondary relative z-10">
                <Map className="w-6 h-6 text-zinc-700" />
              </div>
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Citizen Reports</span>
            </div>
            
            <ArrowRight className="text-zinc-300 hidden md:block z-20" />
            
            <div className="flex flex-col items-center gap-4 z-20 relative group cursor-pointer">
              <div className="w-16 h-16 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-center justify-center btn-secondary relative z-10">
                <BarChart3 className="w-6 h-6 text-indigo-600" />
              </div>
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">AI Chemistry Analytics</span>
            </div>
            
            <ArrowRight className="text-zinc-300 hidden md:block z-20" />
            
            <div className="flex flex-col items-center gap-4 relative z-20 group cursor-pointer">
              <div className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-red-500 rounded-full animate-ping opacity-75 z-30" />
              <div className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white z-30" />
              <div className="w-16 h-16 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-center justify-center btn-secondary relative z-10">
                <ShieldAlert className="w-6 h-6 text-red-600" />
              </div>
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Emergency Action</span>
            </div>

          </div>
        </div>

        {/* Workflow Section */}
        <div className="mt-28 w-full max-w-6xl px-4 animate-spring-up delay-700 text-left">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900">How It Works</h2>
            <p className="text-xs text-zinc-500 mt-1">From raw stream sensor telemetry to community peace of mind</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card !p-6 rounded-2xl bg-white border border-zinc-200">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-4 border border-blue-100">
                <span className="text-blue-600 font-bold text-base">1</span>
              </div>
              <h3 className="text-base font-bold text-zinc-900 mb-2">Pincode Lookups</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">Citizens type their address or postal code to immediately see whether their water is safe to drink or requires boiling.</p>
            </div>

            <div className="card !p-6 rounded-2xl bg-white border border-zinc-200">
              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center mb-4 border border-indigo-100">
                <span className="text-indigo-600 font-bold text-base">2</span>
              </div>
              <h3 className="text-base font-bold text-zinc-900 mb-2">AI Tap Doctor</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">Experiencing brown, cloudy, or sulfur-smelling water? Our AI symptom assistant immediately diagnoses the cause and safety steps.</p>
            </div>

            <div className="card !p-6 rounded-2xl bg-white border border-zinc-200">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center mb-4 border border-emerald-100">
                <span className="text-emerald-600 font-bold text-base">3</span>
              </div>
              <h3 className="text-base font-bold text-zinc-900 mb-2">Community Action</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">Report visual pollution with photo evidence and watch the 4-stage municipal resolution progress in real time.</p>
            </div>
          </div>
        </div>
        
        {/* Enterprise Live Status Marquee */}
        <div className="w-full mt-24 border-y border-zinc-200/60 bg-white/40 backdrop-blur-sm py-4 marquee-container">
          <div className="animate-marquee flex items-center gap-16 text-xs font-semibold text-zinc-600">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex items-center gap-16">
                <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> Active Public Sensors: 14,204</span>
                <span className="flex items-center gap-2">Data Processing: 1.2M Points/hr</span>
                <span className="flex items-center gap-2">Clean Drinking Water Standards: 99.8% BIS 10500:2012 & WHO Compliant</span>
                <span className="flex items-center gap-2 text-blue-600">Open Data Network for Students & Researchers</span>
                <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-indigo-500"></div> AI Diagnostic Models Active</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-zinc-200/80 bg-white py-12 z-10 relative">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center">
              <Droplets className="text-white w-4 h-4" />
            </div>
            <span className="text-base font-bold tracking-tight text-zinc-900">AquaTrust.</span>
          </div>
          
          <div className="flex flex-wrap items-center gap-6 text-xs font-medium text-zinc-500">
            <Link to="/doctor" className="hover:text-zinc-900 transition-colors">Aqua Doctor</Link>
            <Link to="/calculator" className="hover:text-zinc-900 transition-colors">Water Calculator</Link>
            <Link to="/reporting" className="hover:text-zinc-900 transition-colors">Issue Tracker</Link>
            <Link to="/reports" className="hover:text-zinc-900 transition-colors">Open Data Portal</Link>
            <Link to="/dashboard" className="hover:text-zinc-900 transition-colors">Public Map</Link>
            <Link to="/register" className="hover:text-zinc-900 transition-colors">Join Community</Link>
          </div>
          
          <div className="text-xs text-zinc-400">
            © {new Date().getFullYear()} AquaTrust Open Environmental Network.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
