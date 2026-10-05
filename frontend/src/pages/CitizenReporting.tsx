import { useState } from 'react';
import { MessageSquare, Camera, MapPin, Send, CheckCircle2, Search, Clock, ThumbsUp, ShieldAlert, Sparkles } from 'lucide-react';

interface IncidentReport {
  id: string;
  category: string;
  location: string;
  description: string;
  status: 'submitted' | 'triaged' | 'inspecting' | 'resolved';
  submittedAt: string;
  upvotes: number;
  severity: 'low' | 'medium' | 'high';
  resolutionNote?: string;
}

const initialReports: IncidentReport[] = [
  {
    id: 'AQUA-1042',
    category: 'Turbid Water / Muddy Discharge',
    location: 'Sector 35-B Residential Grid, Chandigarh',
    description: 'Tap water running reddish-brown since 7 AM pipeline maintenance near inner market.',
    status: 'resolved',
    submittedAt: '3 hours ago',
    upvotes: 14,
    severity: 'medium',
    resolutionNote: 'MC Chandigarh Water Wing line flush completed at 10:15 AM. Flow restored to safe BIS 10500:2012 baseline.'
  },
  {
    id: 'AQUA-1041',
    category: 'Visible Algal Bloom / Scum',
    location: 'Sukhna Lake Shoreline (Near Rowing Canal)',
    description: 'Thick green algae layer forming across northern inlet bank; mild organic odor detected.',
    status: 'inspecting',
    submittedAt: '5 hours ago',
    upvotes: 28,
    severity: 'high',
    resolutionNote: 'Chandigarh Environment Department field team on-site taking dissolved oxygen & spectrophotometer samples.'
  },
  {
    id: 'AQUA-1039',
    category: 'Industrial Run-off / Chemical Dyeing',
    location: 'Budha Nullah Confluence, Ludhiana',
    description: 'Dark industrial discharge detected upstream of treatment plant bypassing primary interceptor.',
    status: 'triaged',
    submittedAt: '12 hours ago',
    upvotes: 42,
    severity: 'high',
    resolutionNote: 'Punjab Pollution Control Board (PPCB) regional task force dispatched for spot inspection.'
  },
  {
    id: 'AQUA-1035',
    category: 'Low Water Pressure & High Mineral Silt',
    location: 'Sector 70, SAS Nagar Mohali',
    description: 'Kajauli Phase 4 supply feeder experiencing intermittent pressure drop with fine sandy sediment.',
    status: 'submitted',
    submittedAt: 'Yesterday',
    upvotes: 9,
    severity: 'low'
  }
];

export const CitizenReporting = () => {
  const [activeTab, setActiveTab] = useState<'submit' | 'feed'>('submit');
  const [reports, setReports] = useState<IncidentReport[]>(initialReports);
  const [submittedReportId, setSubmittedReportId] = useState<string | null>(null);
  
  // Form State
  const [issueType, setIssueType] = useState('color');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high'>('medium');
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  // Search & Track State
  const [searchTicket, setSearchTicket] = useState('');
  const [searchedReport, setSearchedReport] = useState<IncidentReport | null>(reports[0]);

  const handleLocationDetect = () => {
    setIsDetectingLocation(true);
    setTimeout(() => {
      setLocation('Sector 35-B Chandigarh - Lat 30.7333° N, Long 76.7794° E');
      setIsDetectingLocation(false);
    }, 800);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `AQUA-${Math.floor(1000 + Math.random() * 9000)}`;
    const newReport: IncidentReport = {
      id: newId,
      category: issueType === 'color' ? 'Unusual Water Color' : issueType === 'odor' ? 'Unusual Odor' : 'Visible Pollution',
      location: location || 'Current Location',
      description,
      status: 'submitted',
      submittedAt: 'Just now',
      upvotes: 1,
      severity
    };

    setReports([newReport, ...reports]);
    setSubmittedReportId(newId);
    setSearchedReport(newReport);
  };

  const handleUpvote = (id: string) => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, upvotes: r.upvotes + 1 } : r))
    );
  };

  const handleTrackSearch = (query: string) => {
    setSearchTicket(query);
    const found = reports.find(
      (r) => r.id.toLowerCase() === query.trim().toLowerCase()
    );
    if (found) {
      setSearchedReport(found);
    }
  };

  const getStatusStepIndex = (status: IncidentReport['status']) => {
    switch (status) {
      case 'submitted': return 0;
      case 'triaged': return 1;
      case 'inspecting': return 2;
      case 'resolved': return 3;
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[var(--background)]">
      {/* Header with Navigation Tabs */}
      <header className="h-16 flex items-center justify-between px-6 z-10 header-panel border-b border-zinc-200/80 bg-white/70 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-sm">
            <MessageSquare className="w-4 h-4" />
          </div>
          <h2 className="text-base font-bold text-zinc-900">Citizen Action Portal</h2>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-xl border border-zinc-200">
          <button
            onClick={() => setActiveTab('submit')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'submit'
                ? 'bg-white text-zinc-900 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            Report An Issue
          </button>
          <button
            onClick={() => setActiveTab('feed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'feed'
                ? 'bg-white text-zinc-900 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            Track & Community Feed
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 overflow-y-auto p-6 flex justify-center">
        <div className="w-full max-w-4xl">

          {activeTab === 'submit' ? (
            /* SUBMISSION FORM */
            <div className="max-w-2xl mx-auto">
              <div className="mb-8 text-center">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200 mb-3">
                  <Sparkles className="w-3.5 h-3.5" /> Direct Municipal Link
                </div>
                <h3 className="text-2xl font-bold text-zinc-900 mb-2">Report a Water Hazard</h3>
                <p className="text-sm text-zinc-500">
                  Help protect community health. Reports are immediately routed to municipal field monitors and displayed on the public safety map.
                </p>
              </div>

              {submittedReportId ? (
                <div className="card !p-8 border-emerald-200 bg-emerald-50/40 rounded-2xl flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-zinc-900 mb-1">Report Dispatched Successfully</h4>
                    <p className="text-sm text-emerald-800">
                      Your ticket ID is <strong className="font-mono text-base px-2 py-0.5 bg-white rounded border border-emerald-300">{submittedReportId}</strong>
                    </p>
                  </div>
                  <p className="text-xs text-zinc-500 max-w-md">
                    Our local inspection desk has received your telemetry ping. You can track resolution progress in real time.
                  </p>
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={() => {
                        setActiveTab('feed');
                        setSearchTicket(submittedReportId);
                      }}
                      className="px-5 py-2.5 bg-zinc-900 text-white rounded-xl text-xs font-semibold hover:bg-zinc-800 transition-colors shadow-sm"
                    >
                      Track This Report
                    </button>
                    <button
                      onClick={() => setSubmittedReportId(null)}
                      className="px-4 py-2.5 bg-white border border-zinc-200 text-zinc-700 rounded-xl text-xs font-semibold hover:bg-zinc-50 transition-colors"
                    >
                      File Another Report
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="card !p-6 bg-white border border-zinc-200 rounded-2xl shadow-sm space-y-5">
                  
                  {/* Category & Location */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider">Issue Type</label>
                      <select
                        value={issueType}
                        onChange={(e) => setIssueType(e.target.value)}
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-sm text-zinc-800 focus:outline-none focus:border-blue-500"
                      >
                        <option value="color">Unusual Water Color / Turbidity</option>
                        <option value="odor">Strange Chemical or Sulfur Odor</option>
                        <option value="pollution">Visible Trash / Petroleum Sheen</option>
                        <option value="algae">Toxic Algal Growth / Scum</option>
                        <option value="wildlife">Dead Fish / Distressed Wildlife</option>
                        <option value="pressure">Sudden Pressure Drop / Pipe Burst</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider">Location / Landmark</label>
                        <button
                          type="button"
                          onClick={handleLocationDetect}
                          className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                        >
                          <MapPin className="w-3 h-3" /> {isDetectingLocation ? 'Detecting...' : 'Use My GPS'}
                        </button>
                      </div>
                      <input
                        required
                        type="text"
                        placeholder="e.g. Sector 35-B Chandigarh, Sukhna Lake, or 160017..."
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-sm text-zinc-800 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Severity Pill Selector */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider">Severity Level</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'low', label: 'Minor (Aesthetic)', color: 'border-zinc-200 text-zinc-600 hover:bg-zinc-50' },
                        { id: 'medium', label: 'Moderate (Boil / Odor)', color: 'border-amber-300 bg-amber-50/50 text-amber-800' },
                        { id: 'high', label: 'Urgent (Health Hazard)', color: 'border-rose-300 bg-rose-50/50 text-rose-800' }
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setSeverity(item.id as any)}
                          className={`p-2.5 text-xs font-semibold rounded-xl border text-center transition-all ${
                            severity === item.id ? `${item.color} ring-2 ring-blue-500/20 shadow-sm` : 'border-zinc-200 bg-zinc-50 text-zinc-600'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider">Description & Details</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Describe what you see, smell, or any known circumstances (e.g. nearby road excavation, sudden rain)..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-sm text-zinc-800 focus:outline-none focus:border-blue-500 resize-none"
                    />
                  </div>

                  {/* Photo Upload Zone */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider">Photo Evidence (Optional)</label>
                    <div className="border-2 border-dashed border-zinc-200 rounded-xl p-6 flex flex-col items-center justify-center text-zinc-400 hover:bg-zinc-50 hover:border-zinc-300 transition-colors cursor-pointer">
                      <Camera className="w-8 h-8 mb-2 text-zinc-400" />
                      <span className="text-xs font-semibold text-zinc-700">Click to upload photo or drag & drop</span>
                      <span className="text-[11px] text-zinc-400 mt-0.5">JPG, PNG, or HEIC up to 10MB</span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-all shadow-md shadow-blue-500/20 flex items-center gap-2 cursor-pointer"
                    >
                      <Send className="w-4 h-4" /> Submit Report to Municipal Grid
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            /* TRACKING & COMMUNITY FEED */
            <div className="space-y-8">
              
              {/* Ticket Tracker Lookup Card */}
              <div className="card !p-6 bg-white border border-zinc-200 rounded-2xl shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                  <div>
                    <h3 className="text-lg font-bold text-zinc-900">Track an Issue Resolution</h3>
                    <p className="text-xs text-zinc-500">Enter any ticket reference number to verify current municipal actions</p>
                  </div>
                  
                  <div className="relative min-w-[280px]">
                    <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="e.g. AQUA-1042 or AQUA-1041..."
                      value={searchTicket}
                      onChange={(e) => handleTrackSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {searchedReport && (
                  <div className="p-5 bg-zinc-50/80 rounded-xl border border-zinc-200/80">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                      <div>
                        <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          #{searchedReport.id}
                        </span>
                        <h4 className="text-base font-bold text-zinc-900 mt-1">{searchedReport.category}</h4>
                        <span className="text-xs text-zinc-500">{searchedReport.location} • Submitted {searchedReport.submittedAt}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          searchedReport.status === 'resolved' 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : searchedReport.status === 'inspecting'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          {searchedReport.status.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* Progress Stepper */}
                    <div className="py-4">
                      <div className="grid grid-cols-4 gap-2 text-center relative">
                        {['1. Submitted', '2. Triaged', '3. Inspection', '4. Resolved'].map((stepName, idx) => {
                          const currentStep = getStatusStepIndex(searchedReport.status);
                          const isCompleted = idx <= currentStep;
                          const isCurrent = idx === currentStep;

                          return (
                            <div key={stepName} className="flex flex-col items-center">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-2 transition-all ${
                                isCompleted
                                  ? 'bg-emerald-600 text-white shadow-sm'
                                  : 'bg-zinc-200 text-zinc-500'
                              } ${isCurrent ? 'ring-4 ring-emerald-500/20' : ''}`}>
                                {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                              </div>
                              <span className={`text-[11px] font-semibold ${isCompleted ? 'text-zinc-800' : 'text-zinc-400'}`}>
                                {stepName}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {searchedReport.resolutionNote && (
                      <div className="mt-4 p-3 bg-white rounded-lg border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2">
                        <ShieldAlert className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="block font-semibold">Municipal Update:</strong>
                          <span>{searchedReport.resolutionNote}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Public Community Incident Feed */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-zinc-900">Neighborhood Live Feed</h3>
                  <span className="text-xs text-zinc-500">Live community verified hazard reports</span>
                </div>

                <div className="space-y-3">
                  {reports.map((report) => (
                    <div
                      key={report.id}
                      onClick={() => setSearchedReport(report)}
                      className="card !p-5 bg-white border border-zinc-200 rounded-xl hover:border-blue-400/60 transition-all cursor-pointer shadow-sm group"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-zinc-500">#{report.id}</span>
                          <h4 className="text-sm font-bold text-zinc-900 group-hover:text-blue-600 transition-colors">
                            {report.category}
                          </h4>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-zinc-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {report.submittedAt}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            report.status === 'resolved'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}>
                            {report.status}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-zinc-600 mb-3">{report.description}</p>
                      
                      <div className="flex items-center justify-between pt-3 border-t border-zinc-100 text-xs text-zinc-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-zinc-400" /> {report.location}
                        </span>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpvote(report.id);
                          }}
                          className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-100 hover:bg-blue-50 hover:text-blue-600 transition-colors text-xs font-semibold text-zinc-700"
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                          <span>{report.upvotes} Citizens confirmed</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
export default CitizenReporting;
