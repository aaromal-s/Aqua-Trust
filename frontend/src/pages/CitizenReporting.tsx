import React, { useState } from 'react';
import { MessageSquare, Camera, MapPin, Send, CheckCircle2 } from 'lucide-react';

const CitizenReporting = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000); // Reset after 5s
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[var(--background)]">
      <header className="h-16 flex items-center justify-between px-6 z-10 header-panel">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-green-400" /> Citizen Issue Reporting
        </h2>
      </header>

      <div className="flex-1 overflow-y-auto p-6 flex justify-center">
        <div className="w-full max-w-2xl">
          
          <div className="mb-8 text-center">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Report a Water Issue</h3>
            <p className="text-slate-500">
              Help us protect our water resources. If you notice unusual water color, odors, pollution, or algal growth, report it directly to our monitoring teams.
            </p>
          </div>

          {submitted ? (
            <div className="card border-green-500/30 bg-green-500/10 py-12 flex flex-col items-center text-center">
              <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">Report Submitted Successfully</h3>
              <p className="text-green-400 mb-6">Thank you! Our monitoring team will investigate this issue shortly.</p>
              <button 
                onClick={() => setSubmitted(false)}
                className="px-6 py-2 bg-[var(--card)] border border-[var(--border)] rounded-lg text-sm text-slate-900 hover:bg-slate-900/5 transition-colors"
              >
                Submit Another Report
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="card space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-600">Issue Type</label>
                  <select required className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:border-blue-500">
                    <option value="">Select an issue type...</option>
                    <option value="color">Unusual Water Color</option>
                    <option value="odor">Unusual Odor</option>
                    <option value="pollution">Visible Pollution / Trash</option>
                    <option value="algae">Algal Growth / Scum</option>
                    <option value="wildlife">Dead Fish / Wildlife</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-600">Location</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input required type="text" placeholder="E.g., North River Bridge" className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg pl-10 pr-4 py-2.5 text-slate-900 focus:outline-none focus:border-blue-500" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600">Description</label>
                <textarea required rows={4} placeholder="Please provide detailed information about what you observed..." className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:border-blue-500 resize-none"></textarea>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600">Photo Evidence (Optional)</label>
                <div className="w-full border-2 border-dashed border-[var(--border)] rounded-lg p-8 flex flex-col items-center justify-center text-slate-400 hover:bg-slate-900/5 hover:border-gray-600 transition-colors cursor-pointer">
                  <Camera className="w-8 h-8 mb-2 text-slate-500" />
                  <span className="text-sm">Click to upload or drag & drop</span>
                  <span className="text-xs mt-1">JPG, PNG up to 10MB</span>
                </div>
              </div>

              <div className="pt-4 border-t border-[var(--border)] flex justify-end">
                <button type="submit" className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors flex items-center gap-2">
                  <Send className="w-4 h-4" /> Submit Report
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};

export default CitizenReporting;
