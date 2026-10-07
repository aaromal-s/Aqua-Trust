import { useState } from 'react';
import { 
  Camera, 
  Upload, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Send, 
  RefreshCw 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface TestPad {
  id: string;
  name: string;
  unit: string;
  measuredValue: number;
  safeMin: number;
  safeMax: number;
  colorHex: string;
  status: 'SAFE' | 'WARNING' | 'CRITICAL';
  interpretation: string;
}

const PRESET_SAMPLES = [
  {
    id: 'chd-tap',
    label: 'Chandigarh Sector 35 Municipal Tap',
    pads: [
      { id: 'ph', name: 'pH Balance', unit: '', measuredValue: 7.2, safeMin: 6.5, safeMax: 8.5, colorHex: '#4ade80', status: 'SAFE' as const, interpretation: 'Optimal neutral pH for drinking.' },
      { id: 'cl', name: 'Free Chlorine', unit: 'ppm', measuredValue: 0.4, safeMin: 0.2, safeMax: 1.0, colorHex: '#facc15', status: 'SAFE' as const, interpretation: 'Adequate microbial residual protection.' },
      { id: 'th', name: 'Total Hardness', unit: 'ppm', measuredValue: 140, safeMin: 50, safeMax: 300, colorHex: '#60a5fa', status: 'SAFE' as const, interpretation: 'Moderate mineral hardness; low scaling.' },
      { id: 'no3', name: 'Nitrates (NO3)', unit: 'ppm', measuredValue: 5, safeMin: 0, safeMax: 45, colorHex: '#f472b6', status: 'SAFE' as const, interpretation: 'Well below agricultural contamination threshold.' },
      { id: 'alk', name: 'Total Alkalinity', unit: 'ppm', measuredValue: 120, safeMin: 60, safeMax: 200, colorHex: '#38bdf8', status: 'SAFE' as const, interpretation: 'Good natural buffering capacity.' },
    ]
  },
  {
    id: 'malwa-well',
    label: 'Malwa Deep Agricultural Tubewell',
    pads: [
      { id: 'ph', name: 'pH Balance', unit: '', measuredValue: 7.8, safeMin: 6.5, safeMax: 8.5, colorHex: '#22c55e', status: 'SAFE' as const, interpretation: 'Mildly alkaline.' },
      { id: 'cl', name: 'Free Chlorine', unit: 'ppm', measuredValue: 0.0, safeMin: 0.2, safeMax: 1.0, colorHex: '#f3f4f6', status: 'WARNING' as const, interpretation: 'Zero chlorine residual disinfection.' },
      { id: 'th', name: 'Total Hardness', unit: 'ppm', measuredValue: 420, safeMin: 50, safeMax: 300, colorHex: '#3b82f6', status: 'CRITICAL' as const, interpretation: 'Severe water hardness; severe scaling.' },
      { id: 'no3', name: 'Nitrates (NO3)', unit: 'ppm', measuredValue: 68, safeMin: 0, safeMax: 45, colorHex: '#e11d48', status: 'CRITICAL' as const, interpretation: 'Nitrate toxicity from fertilizer seepage.' },
      { id: 'alk', name: 'Total Alkalinity', unit: 'ppm', measuredValue: 240, safeMin: 60, safeMax: 200, colorHex: '#0284c7', status: 'WARNING' as const, interpretation: 'Elevated alkalinity.' },
    ]
  },
  {
    id: 'budha-outfall',
    label: 'Budha Nullah Downstream Canal Water',
    pads: [
      { id: 'ph', name: 'pH Balance', unit: '', measuredValue: 5.4, safeMin: 6.5, safeMax: 8.5, colorHex: '#f87171', status: 'CRITICAL' as const, interpretation: 'Acidic industrial discharge.' },
      { id: 'cl', name: 'Free Chlorine', unit: 'ppm', measuredValue: 0.0, safeMin: 0.2, safeMax: 1.0, colorHex: '#e5e7eb', status: 'WARNING' as const, interpretation: 'Unchlorinated open drain water.' },
      { id: 'th', name: 'Total Hardness', unit: 'ppm', measuredValue: 510, safeMin: 50, safeMax: 300, colorHex: '#1d4ed8', status: 'CRITICAL' as const, interpretation: 'Extremely high dissolved minerals.' },
      { id: 'no3', name: 'Nitrates (NO3)', unit: 'ppm', measuredValue: 85, safeMin: 0, safeMax: 45, colorHex: '#be123c', status: 'CRITICAL' as const, interpretation: 'Dangerous agricultural & organic runoff.' },
      { id: 'alk', name: 'Total Alkalinity', unit: 'ppm', measuredValue: 35, safeMin: 60, safeMax: 200, colorHex: '#7dd3fc', status: 'CRITICAL' as const, interpretation: 'Severely degraded chemical buffer.' },
    ]
  }
];

export const TestStripScannerPage = () => {
  const navigate = useNavigate();
  const [selectedSample, setSelectedSample] = useState(PRESET_SAMPLES[0]);
  const [isScanning, setIsScanning] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  const handleScanPreset = (sample: typeof PRESET_SAMPLES[0]) => {
    setIsScanning(true);
    setUploadedFileName(null);
    setTimeout(() => {
      setSelectedSample(sample);
      setIsScanning(false);
    }, 600);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      setIsScanning(true);
      setTimeout(() => {
        setIsScanning(false);
      }, 900);
    }
  };

  const criticalCount = selectedSample.pads.filter(p => p.status === 'CRITICAL').length;
  const overallQuality = criticalCount === 0 ? 'Potable & BIS Compliant' : criticalCount === 1 ? 'Requires Filtration (RO/Carbon)' : 'Unsafe for Human Consumption';

  const handleLogToCitizenFeed = () => {
    setSubmissionSuccess(true);
    setTimeout(() => {
      navigate('/reporting', {
        state: {
          prefillDescription: `Rapid 5-in-1 Chemical Strip Test Result for ${selectedSample.label}: pH ${selectedSample.pads[0].measuredValue}, Nitrates ${selectedSample.pads[3].measuredValue} ppm, Hardness ${selectedSample.pads[2].measuredValue} ppm. Verdict: ${overallQuality}.`,
          prefillSeverity: criticalCount > 0 ? 'high' : 'low'
        }
      });
    }, 1200);
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-[var(--background)]">
      {/* Top Header */}
      <header className="px-6 py-4 border-b border-zinc-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-md shadow-teal-500/20">
            <Camera className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-zinc-900 tracking-tight">AI Test Strip Optical Colorimeter</h1>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 border border-teal-200">
                5-in-1 Reagent Scanner
              </span>
            </div>
            <p className="text-xs text-zinc-500">Transform any smartphone or webcam into a lab colorimeter analyzing chemical water test strips</p>
          </div>
        </div>

        <button
          onClick={handleLogToCitizenFeed}
          className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5 self-start md:self-auto"
        >
          <Send className="w-3.5 h-3.5" /> Submit to Community Grid
        </button>
      </header>

      {submissionSuccess && (
        <div className="mx-6 mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          Colorimetric test readings logged successfully! Redirecting to Citizen Grievance Portal...
        </div>
      )}

      <div className="p-6 max-w-6xl w-full mx-auto space-y-6">

        {/* Top Controls: Preset selector & upload */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Presets */}
          <div className="card !p-5 bg-white border border-zinc-200 rounded-2xl shadow-sm md:col-span-2 space-y-3">
            <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider block">
              Choose Test Strip Sample Preset
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {PRESET_SAMPLES.map(sample => (
                <button
                  key={sample.id}
                  onClick={() => handleScanPreset(sample)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedSample.id === sample.id
                      ? 'bg-teal-50/80 border-teal-300 ring-1 ring-teal-200 text-zinc-900'
                      : 'bg-zinc-50 border-zinc-200 hover:bg-zinc-100 text-zinc-700'
                  }`}
                >
                  <span className="text-xs font-bold block">{sample.label}</span>
                  <span className="text-[10px] text-zinc-500 mt-1 block">Click to analyze optical pads</span>
                </button>
              ))}
            </div>
          </div>

          {/* Upload Strip Photo */}
          <div className="card !p-5 bg-white border border-zinc-200 rounded-2xl shadow-sm space-y-3 flex flex-col justify-between">
            <div>
              <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider block mb-1">
                Upload Strip Photo
              </label>
              <p className="text-[11px] text-zinc-500">Capture with camera against a white background</p>
            </div>

            <label className="border-2 border-dashed border-zinc-300 hover:border-teal-500 p-4 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors bg-zinc-50/50">
              <Upload className="w-5 h-5 text-zinc-400 mb-1" />
              <span className="text-xs font-semibold text-zinc-700">
                {uploadedFileName || 'Select or drop strip image'}
              </span>
              <span className="text-[10px] text-zinc-400">JPG, PNG up to 10MB</span>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        </div>

        {/* Optical Scanning Pad Interactive Simulation */}
        <div className="card !p-6 bg-gradient-to-r from-zinc-900 via-slate-900 to-zinc-900 text-white rounded-3xl shadow-xl overflow-hidden relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-teal-400" />
                <h3 className="text-base font-bold">Spectro-Colorimetric Optical Pad Analysis</h3>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">Sample Source: <span className="font-semibold text-white">{selectedSample.label}</span></p>
            </div>

            <div className={`px-4 py-2 rounded-2xl border text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${
              criticalCount === 0 ? 'bg-emerald-950/80 border-emerald-700 text-emerald-300' :
              criticalCount === 1 ? 'bg-amber-950/80 border-amber-700 text-amber-300' :
              'bg-rose-950/80 border-rose-700 text-rose-300'
            }`}>
              <ShieldCheck className="w-4 h-4" />
              {overallQuality}
            </div>
          </div>

          {/* Test Strip Visual Representation */}
          <div className="py-8 flex flex-col items-center">
            {/* The Physical Strip Body */}
            <div className="w-full max-w-2xl bg-zinc-100 p-4 rounded-2xl border border-zinc-300 shadow-2xl flex items-center justify-between gap-3 text-zinc-900">
              <div className="w-16 h-8 bg-zinc-200 rounded-lg flex items-center justify-center text-[10px] font-bold text-zinc-400 uppercase tracking-widest shrink-0">
                HANDLE
              </div>

              {selectedSample.pads.map(pad => (
                <div key={pad.id} className="flex-1 flex flex-col items-center">
                  {/* Colorimetric Reagent Pad */}
                  <div 
                    className="w-12 h-12 rounded-xl shadow-inner border-2 border-white/80 transition-all transform hover:scale-110 flex items-center justify-center font-mono font-bold text-xs"
                    style={{ backgroundColor: pad.colorHex }}
                  >
                    <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)] text-white">
                      {pad.measuredValue}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-zinc-700 mt-1.5">{pad.name.split(' ')[0]}</span>
                </div>
              ))}
            </div>

            {isScanning && (
              <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-teal-400 animate-pulse">
                <RefreshCw className="w-4 h-4 animate-spin" />
                Calibrating RGB reflectance matrix against BIS 10500 standard...
              </div>
            )}
          </div>
        </div>

        {/* Detailed Parameter Interpretation Cards */}
        <div>
          <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4">
            Chemical Reagent Pad Readings & Health Interpretations
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {selectedSample.pads.map(pad => (
              <div key={pad.id} className={`card !p-4 bg-white border rounded-2xl shadow-sm ${
                pad.status === 'CRITICAL' ? 'border-rose-300 ring-1 ring-rose-200' :
                pad.status === 'WARNING' ? 'border-amber-300 ring-1 ring-amber-200' : 'border-zinc-200'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: pad.colorHex }} />
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    pad.status === 'CRITICAL' ? 'bg-rose-100 text-rose-800' :
                    pad.status === 'WARNING' ? 'bg-amber-100 text-amber-800' :
                    'bg-emerald-100 text-emerald-800'
                  }`}>
                    {pad.status}
                  </span>
                </div>

                <span className="text-xs font-bold text-zinc-800 block leading-tight">{pad.name}</span>
                <div className="text-xl font-bold font-mono text-zinc-900 mt-1">
                  {pad.measuredValue} <span className="text-xs font-normal text-zinc-500">{pad.unit}</span>
                </div>

                <p className="text-[11px] text-zinc-500 mt-2 leading-relaxed">
                  {pad.interpretation}
                </p>

                <div className="mt-3 pt-2 border-t border-zinc-100 text-[10px] text-zinc-400">
                  Target: {pad.safeMin} - {pad.safeMax} {pad.unit}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default TestStripScannerPage;
