import { useState, useRef, useEffect, useCallback } from 'react';
import { AlertTriangle, ShieldCheck, Droplets, Sparkles, Sliders } from 'lucide-react';

export const WaterComparisonScrubber = () => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false);
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        handleMove(e.clientX);
      }
    };
    const handleGlobalTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches.length > 0) {
        handleMove(e.touches[0].clientX);
      }
    };

    if (isDragging) {
      window.addEventListener('mouseup', handleGlobalMouseUp);
      window.addEventListener('mousemove', handleGlobalMouseMove);
      window.addEventListener('touchend', handleGlobalMouseUp);
      window.addEventListener('touchmove', handleGlobalTouchMove);
    }

    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('touchend', handleGlobalMouseUp);
      window.removeEventListener('touchmove', handleGlobalTouchMove);
    };
  }, [isDragging, handleMove]);

  return (
    <div className="w-full max-w-4xl mx-auto my-12">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200 mb-2">
          <Sparkles className="w-3.5 h-3.5" /> Interactive Visual Inspection
        </div>
        <h3 className="text-2xl md:text-3xl font-bold text-zinc-900 tracking-tight">
          Drag to Reveal: Raw vs. AquaTrust Protected Flow
        </h3>
        <p className="text-xs md:text-sm text-zinc-500 max-w-lg mx-auto">
          Drag the center handle horizontally to see what raw municipal water looks like compared to an AI-calibrated pure supply.
        </p>
      </div>

      {/* Scrubber Container */}
      <div 
        ref={containerRef}
        onMouseDown={(e) => {
          setIsDragging(true);
          handleMove(e.clientX);
        }}
        onTouchStart={(e) => {
          setIsDragging(true);
          if (e.touches.length > 0) handleMove(e.touches[0].clientX);
        }}
        className="relative h-[340px] md:h-[400px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white select-none cursor-ew-resize bg-zinc-900"
      >
        {/* Layer 1: Right Side / Pure Water (AquaTrust Monitored) */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900 via-blue-900 to-indigo-950 flex flex-col justify-between p-6 md:p-8">
          
          {/* Subtle clean water highlights */}
          <div className="absolute top-10 right-10 w-64 h-64 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex justify-end z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> AquaTrust Protected Flow
            </div>
          </div>

          {/* Pure Metrics Overlay (Right) */}
          <div className="flex justify-end z-10">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-2xl text-right space-y-2 max-w-xs shadow-lg">
              <span className="text-[10px] font-bold text-cyan-300 uppercase tracking-widest block">
                Continuous IoT AI Optimization
              </span>
              <div className="text-xl md:text-2xl font-bold text-white flex items-center justify-end gap-2">
                <span>99.8% Purity Index</span>
                <Droplets className="w-5 h-5 text-cyan-400" />
              </div>
              <div className="text-xs text-cyan-100 flex items-center justify-end gap-3 pt-1 border-t border-white/10">
                <span>Turbidity: <strong>0.8 NTU</strong></span>
                <span>pH: <strong>7.4</strong></span>
                <span>Chlorine: <strong>Safe</strong></span>
              </div>
              <p className="text-[11px] text-cyan-200/90 leading-tight">
                Bio-film free • Micro-filtration synchronized • 100% WHO Compliant
              </p>
            </div>
          </div>
        </div>

        {/* Layer 2: Left Side / Contaminated Water (Clipped by sliderPosition) */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-amber-950 via-yellow-950 to-stone-900 flex flex-col justify-between p-6 md:p-8 overflow-hidden"
          style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
        >
          {/* Murky silt particle effects */}
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-amber-600/15 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex justify-start z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/20 border border-rose-400/40 text-rose-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <AlertTriangle className="w-4 h-4 text-rose-400" /> Unmonitored Tap / Raw Stream
            </div>
          </div>

          {/* Contaminated Metrics Overlay (Left) */}
          <div className="flex justify-start z-10">
            <div className="bg-black/40 backdrop-blur-xl border border-rose-500/30 p-4 rounded-2xl text-left space-y-2 max-w-xs shadow-lg">
              <span className="text-[10px] font-bold text-rose-400 uppercase tracking-widest block">
                Undetected Contamination Hazard
              </span>
              <div className="text-xl md:text-2xl font-bold text-rose-100 flex items-center gap-2">
                <span>Critical Anomaly</span>
                <AlertTriangle className="w-5 h-5 text-rose-500" />
              </div>
              <div className="text-xs text-rose-200 flex items-center gap-3 pt-1 border-t border-rose-500/20">
                <span>Turbidity: <strong>16.4 NTU</strong></span>
                <span>pH: <strong>5.4</strong></span>
                <span>Rust Silt: <strong>High</strong></span>
              </div>
              <p className="text-[11px] text-rose-300 leading-tight">
                Excess heavy pipe sediment • Elevated coliform bacteria risk • Odor active
              </p>
            </div>
          </div>
        </div>

        {/* Vertical Divider Line with Grab Handle */}
        <div 
          className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)] z-20 pointer-events-none"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white text-zinc-800 shadow-2xl flex items-center justify-center border-2 border-zinc-200">
            <Sliders className="w-4 h-4 text-zinc-700 transform rotate-90" />
          </div>
        </div>

      </div>

      {/* Quick Interactive Presets */}
      <div className="flex items-center justify-center gap-3 mt-4 text-xs">
        <button
          onClick={() => setSliderPosition(20)}
          className="px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-semibold transition-colors"
        >
          View More Clean
        </button>
        <button
          onClick={() => setSliderPosition(50)}
          className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 font-bold border border-blue-200 transition-colors"
        >
          50 / 50 Comparison
        </button>
        <button
          onClick={() => setSliderPosition(80)}
          className="px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-semibold transition-colors"
        >
          Inspect Contaminants
        </button>
      </div>
    </div>
  );
};

export default WaterComparisonScrubber;
