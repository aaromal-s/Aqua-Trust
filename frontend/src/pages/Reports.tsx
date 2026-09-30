import { FileText, Download, Calendar, BarChart, FileDown } from 'lucide-react';

const reports = [
  { id: 'REP-1042', title: 'Monthly Water Quality Summary', date: 'Sep 2026', type: 'Monthly', status: 'Ready' },
  { id: 'REP-1041', title: 'Weekly Incident & Alert Log', date: 'Sep 21-27, 2026', type: 'Weekly', status: 'Ready' },
  { id: 'REP-1040', title: 'Estuary South Anomaly Report', date: 'Sep 24, 2026', type: 'Incident', status: 'Ready' },
  { id: 'REP-1039', title: 'Daily Sensor Health Check', date: 'Sep 30, 2026', type: 'Daily', status: 'Ready' },
];

const Reports = () => {
  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[var(--background)]">
      <header className="h-16 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md flex items-center justify-between px-6 z-10">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <FileText className="w-5 h-5 text-gray-400" /> Professional Reports
        </h2>
        <button className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors flex items-center gap-2">
          <BarChart className="w-4 h-4" /> Custom Report
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-6">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card border-blue-500/20 bg-blue-500/5 cursor-pointer hover:bg-blue-500/10 transition-colors">
            <h3 className="text-lg font-bold text-white mb-2">Daily Summary</h3>
            <p className="text-sm text-gray-400 mb-4">Generate standard 24h water quality metrics.</p>
            <button className="flex items-center gap-2 text-blue-400 text-sm font-semibold">
              <Download className="w-4 h-4" /> Generate PDF
            </button>
          </div>
          <div className="card cursor-pointer hover:bg-white/5 transition-colors">
            <h3 className="text-lg font-bold text-white mb-2">Weekly Assessment</h3>
            <p className="text-sm text-gray-400 mb-4">Full breakdown of trends, alerts, and locations.</p>
            <button className="flex items-center gap-2 text-white/70 text-sm font-semibold">
              <Download className="w-4 h-4" /> Generate PDF
            </button>
          </div>
          <div className="card cursor-pointer hover:bg-white/5 transition-colors">
            <h3 className="text-lg font-bold text-white mb-2">Location Report</h3>
            <p className="text-sm text-gray-400 mb-4">Detailed analysis for a specific monitoring zone.</p>
            <button className="flex items-center gap-2 text-white/70 text-sm font-semibold">
              <Download className="w-4 h-4" /> Generate PDF
            </button>
          </div>
        </div>

        <h3 className="font-semibold mb-4 text-lg flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gray-500" /> Recent Generated Reports
        </h3>
        
        <div className="card p-0 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 border-b border-[var(--border)]">
              <tr>
                <th className="px-6 py-4 font-medium text-gray-400">Report ID</th>
                <th className="px-6 py-4 font-medium text-gray-400">Title</th>
                <th className="px-6 py-4 font-medium text-gray-400">Period</th>
                <th className="px-6 py-4 font-medium text-gray-400">Type</th>
                <th className="px-6 py-4 font-medium text-gray-400 text-right">Download</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-400">{report.id}</td>
                  <td className="px-6 py-4 font-semibold text-white">{report.title}</td>
                  <td className="px-6 py-4 text-gray-400">{report.date}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-white/10 rounded text-xs text-gray-300">{report.type}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-3">
                      <button className="text-gray-400 hover:text-white transition-colors" title="Download PDF">
                        <FileDown className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default Reports;
