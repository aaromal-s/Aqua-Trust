import { useState } from 'react';
import { FileText, Download, Calendar, FileDown, Database, Code, CheckCircle2, Copy } from 'lucide-react';

const reports = [
  { id: 'REP-1042', title: 'Monthly Water Quality Summary (Tricity & Punjab)', date: 'Sep 2026', type: 'Monthly', status: 'Ready' },
  { id: 'REP-1041', title: 'Weekly Incident & Alert Log (MC Chandigarh / PPCB)', date: 'Sep 21-27, 2026', type: 'Weekly', status: 'Ready' },
  { id: 'REP-1040', title: 'Ludhiana Budha Nullah Effluent Incident Report', date: 'Sep 24, 2026', type: 'Incident', status: 'Ready' },
  { id: 'REP-1039', title: 'Daily Sensor Health Check (Kajauli & Sukhna Grid)', date: 'Sep 30, 2026', type: 'Daily', status: 'Ready' },
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

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[var(--background)]">
      {/* Header */}
      <header className="h-16 flex items-center justify-between px-6 z-10 header-panel border-b border-zinc-200/80 bg-white/70 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          <h2 className="text-base font-bold text-zinc-900">Reports & Transparency Portal</h2>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-xl border border-zinc-200">
          <button
            onClick={() => setActiveTab('standard')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'standard' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            Compliance Reports
          </button>
          <button
            onClick={() => setActiveTab('opendata')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'opendata' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-blue-600" /> Open Data for Researchers
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-5xl mx-auto space-y-8">
          
          {activeTab === 'standard' ? (
            /* COMPLIANCE & INCIDENT REPORTS */
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card !p-5 border-blue-500/20 bg-blue-50/40 rounded-2xl hover:bg-blue-50/70 transition-colors">
                  <h3 className="text-base font-bold text-zinc-900 mb-1">Daily Public Summary</h3>
                  <p className="text-xs text-zinc-600 mb-4">Standard 24h water quality metrics for city distribution.</p>
                  <button 
                    onClick={() => handleDownloadDataset('json')}
                    className="flex items-center gap-2 text-blue-600 text-xs font-bold hover:text-blue-700"
                  >
                    <Download className="w-4 h-4" /> Download PDF Summary
                  </button>
                </div>

                <div className="card !p-5 bg-white border border-zinc-200 rounded-2xl hover:bg-zinc-50 transition-colors">
                  <h3 className="text-base font-bold text-zinc-900 mb-1">Weekly Watershed Audit</h3>
                  <p className="text-xs text-zinc-600 mb-4">Full breakdown of regional trends, incidents, and filtration health.</p>
                  <button 
                    onClick={() => handleDownloadDataset('json')}
                    className="flex items-center gap-2 text-zinc-700 text-xs font-bold hover:text-zinc-900"
                  >
                    <Download className="w-4 h-4" /> Download PDF Audit
                  </button>
                </div>

                <div className="card !p-5 bg-white border border-zinc-200 rounded-2xl hover:bg-zinc-50 transition-colors">
                  <h3 className="text-base font-bold text-zinc-900 mb-1">Zone Incident Deep-Dive</h3>
                  <p className="text-xs text-zinc-600 mb-4">Laboratory chemical assays and anomaly telemetry timelines.</p>
                  <button 
                    onClick={() => handleDownloadDataset('json')}
                    className="flex items-center gap-2 text-zinc-700 text-xs font-bold hover:text-zinc-900"
                  >
                    <Download className="w-4 h-4" /> Download PDF Log
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
                        <th className="px-6 py-3.5 font-bold text-zinc-500 uppercase tracking-wider text-right">Download</th>
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
                              onClick={() => handleDownloadDataset('json')}
                              className="text-zinc-400 hover:text-zinc-800 transition-colors p-1"
                              title="Download PDF"
                            >
                              <FileDown className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            /* OPEN DATA & RESEARCH HUB */
            <div className="space-y-6">
              
              {/* Data Export Hero */}
              <div className="card !p-6 bg-gradient-to-br from-zinc-900 to-zinc-800 text-white rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-2">
                    <Database className="w-3.5 h-3.5" /> Public Open Data License (CC-BY 4.0)
                  </div>
                  <h3 className="text-xl font-bold mb-1">Download Free Water Telemetry Datasets</h3>
                  <p className="text-zinc-300 text-xs max-w-lg leading-relaxed">
                    Designed for university researchers, environmental journalists, and school science programs. Anonymized 30-day continuous sensor readings with full sensor calibration metadata.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => handleDownloadDataset('csv')}
                    className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors flex items-center gap-2 shadow-md shadow-blue-500/20"
                  >
                    <Download className="w-4 h-4" /> Download CSV (.csv)
                  </button>
                  <button
                    onClick={() => handleDownloadDataset('json')}
                    className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-colors flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" /> Download JSON (.json)
                  </button>
                </div>
              </div>

              {/* Standards Comparison Table */}
              <div className="card !p-6 bg-white border border-zinc-200 rounded-2xl shadow-sm">
                <h4 className="text-sm font-bold text-zinc-900 uppercase tracking-wider mb-1">
                  Indian & Global Water Quality Standards Matrix
                </h4>
                <p className="text-xs text-zinc-500 mb-4">
                  How our current regional telemetry compares against Bureau of Indian Standards (BIS 10500:2012) and World Health Organization (WHO) Guidelines:
                </p>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-zinc-50 border-y border-zinc-200">
                      <tr>
                        <th className="px-4 py-3 font-bold text-zinc-600">Chemical Parameter</th>
                        <th className="px-4 py-3 font-bold text-zinc-600">BIS 10500:2012 (India)</th>
                        <th className="px-4 py-3 font-bold text-zinc-600">WHO Guideline</th>
                        <th className="px-4 py-3 font-bold text-zinc-600">AquaTrust Measured</th>
                        <th className="px-4 py-3 font-bold text-zinc-600 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {standardsComparison.map((row) => (
                        <tr key={row.parameter} className="hover:bg-zinc-50/50">
                          <td className="px-4 py-3 font-semibold text-zinc-800">{row.parameter}</td>
                          <td className="px-4 py-3 text-zinc-600 font-mono font-semibold">{row.bis}</td>
                          <td className="px-4 py-3 text-zinc-500 font-mono">{row.who}</td>
                          <td className="px-4 py-3 font-bold text-zinc-900 font-mono">{row.current}</td>
                          <td className="px-4 py-3 text-right">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700">
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Developer / Researcher API Snippet */}
              <div className="card !p-5 bg-zinc-900 text-white rounded-2xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4 text-blue-400" />
                    <span className="text-xs font-mono text-zinc-300 font-bold">Public REST API (Live Feed Endpoint)</span>
                  </div>
                  <button
                    onClick={handleCopyCode}
                    className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors bg-white/5 px-2.5 py-1 rounded-lg border border-white/10"
                  >
                    {copiedSnippet ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedSnippet ? 'Copied!' : 'Copy cURL'}
                  </button>
                </div>
                <pre className="text-xs font-mono text-zinc-400 bg-black/40 p-3.5 rounded-xl overflow-x-auto">
{`curl -X GET "https://api.aquatrust.org/v1/telemetry/public" \\
  -H "Accept: application/json"`}
                </pre>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
export default Reports;
