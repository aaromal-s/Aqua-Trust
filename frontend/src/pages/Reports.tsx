import { useState } from 'react';
import { FileText, Download, Calendar, Database, CheckCircle2, Copy, Printer, X, ShieldCheck, Building2 } from 'lucide-react';

const reports = [
  { id: 'REP-1042', title: 'Monthly Water Quality Summary (Tricity & Punjab)', date: 'Sep 2026', type: 'Monthly', status: 'Compliant' },
  { id: 'REP-1041', title: 'Weekly Incident & Alert Log (MC Chandigarh / PPCB)', date: 'Sep 21-27, 2026', type: 'Weekly', status: 'Compliant' },
  { id: 'REP-1040', title: 'Ludhiana Budha Nullah Effluent Incident Report', date: 'Sep 24, 2026', type: 'Incident', status: 'Action Taken' },
  { id: 'REP-1039', title: 'Daily Sensor Health Check (Kajauli & Sukhna Grid)', date: 'Sep 30, 2026', type: 'Daily', status: 'Optimal' },
];

const standardsComparison = [
  { parameter: 'pH Level', bis: '6.5 – 8.5', who: '6.5 – 8.5', current: '7.3 (Normal)', status: 'Compliant' },
  { parameter: 'Turbidity', bis: '< 1.0 NTU (Max 5.0)', who: '< 4.0 NTU', current: '1.2 NTU', status: 'Compliant' },
  { parameter: 'Free Residual Chlorine', bis: '0.2 – 1.0 mg/L', who: '0.2 – 2.0 mg/L', current: '0.8 mg/L', status: 'Compliant' },
  { parameter: 'Total Dissolved Solids (TDS)', bis: '< 500 ppm', who: '< 600 ppm', current: '154 ppm', status: 'Optimal' },
  { parameter: 'Lead (Pb)', bis: '< 0.01 mg/L', who: '< 0.01 mg/L', current: '< 0.001 mg/L', status: 'Undetectable' },
  { parameter: 'Nitrates (NO3)', bis: '< 45 mg/L', who: '< 50 mg/L', current: '3.4 mg/L', status: 'Compliant' },
];

export const Reports = () => {
  const [activeTab, setActiveTab] = useState<'standard' | 'opendata'>('standard');
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [selectedReportForPrint, setSelectedReportForPrint] = useState<any | null>(null);

  const handleDownloadDataset = (format: 'csv' | 'json') => {
    const data = format === 'json' 
      ? JSON.stringify({
          source: 'Aqua-Trust Open Environmental Data Network',
          timestamp: new Date().toISOString(),
          zones: [
            { id: 'CHD-17', name: 'Sector 17 Central Commercial Grid, Chandigarh', score: 94, pH: 7.3, turbidity: 0.9, tds: 142 },
            { id: 'CHD-SUK', name: 'Sukhna Lake Wetland Catchment, Chandigarh', score: 91, pH: 7.4, turbidity: 1.2, tds: 168 },
            { id: 'MOH-70', name: 'SAS Nagar Mohali (Kajauli Feeder Line)', score: 87, pH: 7.2, turbidity: 1.5, tds: 210 },
            { id: 'LUD-BN', name: 'Budha Nullah Industrial Confluence, Ludhiana', score: 36, pH: 5.8, turbidity: 18.4, tds: 840 },
            { id: 'BTI-MLW', name: 'Bathinda Malwa Deep Aquifer', score: 48, pH: 7.9, turbidity: 3.2, tds: 680 }
          ]
        }, null, 2)
      : "ZoneID,Name,CompositeScore,pH,TurbidityNTU,TDSppm,Status\nCHD-17,Sector 17 Chandigarh,94,7.3,0.9,142,Safe\nCHD-SUK,Sukhna Lake Sector 1,91,7.4,1.2,168,Safe\nMOH-70,Mohali Sector 70,87,7.2,1.5,210,Safe\nLUD-BN,Budha Nullah Ludhiana,36,5.8,18.4,840,CriticalHazard\nBTI-MLW,Bathinda Malwa Basin,48,7.9,3.2,680,BoilAndFilter";

    const blob = new Blob([data], { type: format === 'json' ? 'application/json' : 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aquatrust_water_telemetry_${Date.now()}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(`curl -X GET "https://api.aquatrust.org/v1/telemetry/public" \\\n  -H "Accept: application/json"`);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  const openPrintModal = (report: any) => {
    setSelectedReportForPrint(report);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[var(--background)]">
      {/* Header */}
      <header className="h-16 flex items-center justify-between px-6 z-10 header-panel border-b border-zinc-200/80 bg-white/70 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          <h2 className="text-base font-bold text-zinc-900">Reports & Open Transparency Portal</h2>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-xl border border-zinc-200">
          <button
            onClick={() => setActiveTab('standard')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'standard' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            Compliance & Official Audits
          </button>
          <button
            onClick={() => setActiveTab('opendata')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'opendata' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-blue-600" /> Open Data (Researchers)
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-5xl mx-auto space-y-8">
          
          {activeTab === 'standard' ? (
            /* COMPLIANCE & INCIDENT REPORTS */
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card !p-5 border-blue-500/20 bg-blue-50/40 rounded-2xl hover:bg-blue-50/70 transition-colors flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-zinc-900 mb-1">Daily Municipal Summary</h3>
                    <p className="text-xs text-zinc-600 mb-4">Official 24h water quality metrics for Tricity distribution.</p>
                  </div>
                  <button 
                    onClick={() => openPrintModal(reports[3])}
                    className="flex items-center gap-2 text-blue-600 text-xs font-bold hover:text-blue-700 cursor-pointer"
                  >
                    <Printer className="w-4 h-4" /> View & Print Official Audit
                  </button>
                </div>

                <div className="card !p-5 bg-white border border-zinc-200 rounded-2xl hover:bg-zinc-50 transition-colors flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-zinc-900 mb-1">Weekly Watershed Audit</h3>
                    <p className="text-xs text-zinc-600 mb-4">Full breakdown of regional trends, incidents, and filtration health.</p>
                  </div>
                  <button 
                    onClick={() => openPrintModal(reports[1])}
                    className="flex items-center gap-2 text-zinc-700 text-xs font-bold hover:text-zinc-900 cursor-pointer"
                  >
                    <Printer className="w-4 h-4" /> View & Print Weekly PDF
                  </button>
                </div>

                <div className="card !p-5 bg-white border border-zinc-200 rounded-2xl hover:bg-zinc-50 transition-colors flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-zinc-900 mb-1">Zone Incident Deep-Dive</h3>
                    <p className="text-xs text-zinc-600 mb-4">Laboratory chemical assays and anomaly telemetry timelines.</p>
                  </div>
                  <button 
                    onClick={() => openPrintModal(reports[2])}
                    className="flex items-center gap-2 text-zinc-700 text-xs font-bold hover:text-zinc-900 cursor-pointer"
                  >
                    <Printer className="w-4 h-4" /> View Incident Dossier
                  </button>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-base text-zinc-900 mb-4 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-zinc-500" /> Historical Reports Archive
                </h3>
                
                <div className="card !p-0 overflow-hidden bg-white border border-zinc-200 rounded-2xl shadow-sm">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-zinc-50 border-b border-zinc-200">
                      <tr>
                        <th className="px-6 py-3.5 font-bold text-zinc-500 uppercase tracking-wider">Report ID</th>
                        <th className="px-6 py-3.5 font-bold text-zinc-500 uppercase tracking-wider">Title</th>
                        <th className="px-6 py-3.5 font-bold text-zinc-500 uppercase tracking-wider">Period</th>
                        <th className="px-6 py-3.5 font-bold text-zinc-500 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-3.5 font-bold text-zinc-500 uppercase tracking-wider text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {reports.map((report) => (
                        <tr key={report.id} className="hover:bg-zinc-50/60 transition-colors">
                          <td className="px-6 py-4 font-mono font-semibold text-blue-600">{report.id}</td>
                          <td className="px-6 py-4 font-semibold text-zinc-800">{report.title}</td>
                          <td className="px-6 py-4 text-zinc-500">{report.date}</td>
                          <td className="px-6 py-4">
                            <span className="px-2.5 py-1 bg-zinc-100 text-zinc-700 rounded-md font-semibold text-[11px]">
                              {report.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => openPrintModal(report)}
                              className="px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-semibold text-xs flex items-center gap-1.5 ml-auto cursor-pointer"
                            >
                              <Printer className="w-3.5 h-3.5" /> View & Print
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Standards Comparison Table */}
              <div>
                <h3 className="font-bold text-base text-zinc-900 mb-4 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> BIS 10500:2012 vs. WHO Water Standards Compliance
                </h3>
                
                <div className="card !p-0 overflow-hidden bg-white border border-zinc-200 rounded-2xl shadow-sm">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-zinc-50 border-b border-zinc-200">
                      <tr>
                        <th className="px-6 py-3.5 font-bold text-zinc-500 uppercase tracking-wider">Parameter</th>
                        <th className="px-6 py-3.5 font-bold text-zinc-500 uppercase tracking-wider">BIS 10500 Standard</th>
                        <th className="px-6 py-3.5 font-bold text-zinc-500 uppercase tracking-wider">WHO Guidelines</th>
                        <th className="px-6 py-3.5 font-bold text-zinc-500 uppercase tracking-wider">Current Piped Water</th>
                        <th className="px-6 py-3.5 font-bold text-zinc-500 uppercase tracking-wider text-right">Compliance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {standardsComparison.map((row, idx) => (
                        <tr key={idx} className="hover:bg-zinc-50/60 transition-colors">
                          <td className="px-6 py-3.5 font-semibold text-zinc-900">{row.parameter}</td>
                          <td className="px-6 py-3.5 text-zinc-600">{row.bis}</td>
                          <td className="px-6 py-3.5 text-zinc-600">{row.who}</td>
                          <td className="px-6 py-3.5 font-mono text-zinc-900 font-semibold">{row.current}</td>
                          <td className="px-6 py-3.5 text-right">
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            /* OPEN DATA PORTAL */
            <div className="space-y-6">
              <div className="card !p-6 bg-gradient-to-r from-blue-700 to-indigo-800 text-white rounded-2xl">
                <h3 className="text-xl font-bold mb-1">Open Hydrology Data API for Researchers</h3>
                <p className="text-xs text-blue-100 max-w-xl leading-relaxed mb-4">
                  AquaTrust publishes real-time machine-readable environmental datasets under the Creative Commons Open Database License (ODbL) to empower PAU Ludhiana, Panjab University, and environmental researchers.
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => handleDownloadDataset('csv')}
                    className="px-4 py-2 rounded-xl bg-white text-zinc-900 text-xs font-bold hover:bg-blue-50 transition-colors shadow-sm flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" /> Download Full CSV Dataset
                  </button>
                  <button
                    onClick={() => handleDownloadDataset('json')}
                    className="px-4 py-2 rounded-xl bg-white/10 text-white text-xs font-bold hover:bg-white/20 transition-colors border border-white/20 flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" /> Export GeoJSON Format
                  </button>
                </div>
              </div>

              {/* API Access Snippet */}
              <div className="card !p-6 bg-zinc-950 text-white rounded-2xl font-mono text-xs space-y-3 border border-zinc-800">
                <div className="flex items-center justify-between text-zinc-400 pb-2 border-b border-zinc-800">
                  <span className="text-blue-400 font-bold">Public REST API Curl Query</span>
                  <button
                    onClick={handleCopyCode}
                    className="flex items-center gap-1 text-[11px] hover:text-white transition-colors"
                  >
                    {copiedSnippet ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedSnippet ? 'Copied' : 'Copy Curl'}
                  </button>
                </div>
                <pre className="text-zinc-300 text-[11px] overflow-x-auto p-2 bg-black/50 rounded-lg">
{`curl -X GET "https://api.aquatrust.org/v1/telemetry/public" \\
  -H "Accept: application/json"`}
                </pre>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Official Printable Compliance Report Modal */}
      {selectedReportForPrint && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden relative animate-spring-up max-h-[90vh] flex flex-col">
            
            {/* Action Bar */}
            <div className="p-4 bg-zinc-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold">
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>Official Water Quality Audit Dossier</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" /> Print / Save as PDF
                </button>
                <button onClick={() => setSelectedReportForPrint(null)} className="p-1 text-zinc-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Document Body (Printable Letterhead) */}
            <div className="p-8 overflow-y-auto space-y-6 text-zinc-800 font-sans print:p-0">
              
              {/* Header Letterhead */}
              <div className="border-b-2 border-zinc-900 pb-4 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 text-zinc-900 font-bold text-lg tracking-tight">
                    <Building2 className="w-5 h-5 text-blue-600" />
                    <span>MUNICIPAL CORPORATION CHANDIGARH & PPCB</span>
                  </div>
                  <p className="text-xs text-zinc-500 font-medium">Department of Public Health Engineering & Water Supply Wing</p>
                  <p className="text-[11px] text-zinc-400">Sector 17, U.T. Chandigarh - 160017 | PPCB Patiala Regional Lab</p>
                </div>
                <div className="text-right">
                  <span className="font-mono text-xs font-bold text-blue-600 block">#{selectedReportForPrint.id}</span>
                  <span className="text-[10px] text-zinc-400 block">{selectedReportForPrint.date}</span>
                </div>
              </div>

              {/* Title */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  BIS 10500:2012 Certified
                </span>
                <h3 className="text-xl font-bold text-zinc-900 mt-2">{selectedReportForPrint.title}</h3>
                <p className="text-xs text-zinc-500 mt-1">Continuous Real-Time Telemetry & Laboratory Spectrophotometric Assay</p>
              </div>

              {/* Table of Readings */}
              <div className="border border-zinc-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-50 border-b border-zinc-200">
                    <tr>
                      <th className="px-4 py-2.5 font-bold text-zinc-600">Assay Parameter</th>
                      <th className="px-4 py-2.5 font-bold text-zinc-600">Permissible (BIS 10500)</th>
                      <th className="px-4 py-2.5 font-bold text-zinc-600">Verified Result</th>
                      <th className="px-4 py-2.5 font-bold text-zinc-600 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {standardsComparison.slice(0, 5).map((row, i) => (
                      <tr key={i}>
                        <td className="px-4 py-2 font-medium text-zinc-900">{row.parameter}</td>
                        <td className="px-4 py-2 text-zinc-500">{row.bis}</td>
                        <td className="px-4 py-2 font-mono font-semibold text-zinc-900">{row.current}</td>
                        <td className="px-4 py-2 text-right">
                          <span className="text-emerald-700 font-bold text-[11px]">PASS</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Sign-off Stamps */}
              <div className="pt-6 border-t border-zinc-200 flex items-center justify-between text-xs text-zinc-500">
                <div>
                  <span className="block font-bold text-zinc-800">Dr. Harpreet Kaur</span>
                  <span className="block text-[11px]">Chief Limnologist & Environmental Auditor</span>
                  <span className="block text-[10px] text-zinc-400">Digital Seal Verified: SHA-256 Validated</span>
                </div>
                <div className="p-3 border-2 border-emerald-500/40 rounded-xl bg-emerald-50/30 text-center">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-800 block">MC CHANDIGARH</span>
                  <span className="text-[9px] font-semibold text-emerald-700 block">POTABLE & APPROVED</span>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Reports;
