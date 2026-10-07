import { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  QrCode, 
  Search, 
  Lock, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle, 
  Printer, 
  Copy, 
  PlusCircle, 
  Sparkles, 
  BadgeCheck 
} from 'lucide-react';
import { 
  fetchAllPassports, 
  verifyPassport, 
  issuePassport, 
  type WaterPassport, 
  type VerificationResult 
} from '../services/cryptoTrustService';

export const WaterPassportPage = () => {
  const [activeTab, setActiveTab] = useState<'verify' | 'ledger' | 'issue'>('verify');
  const [passports, setPassports] = useState<WaterPassport[]>([]);
  const [searchQuery, setSearchQuery] = useState('PASSPORT-PB-CHD-001');
  const [verification, setVerification] = useState<VerificationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // New Passport Form State
  const [newFacility, setNewFacility] = useState('');
  const [facilityType, setFacilityType] = useState<WaterPassport['facilityType']>('COMMERCIAL_TANKER');
  const [locationName, setLocationName] = useState('Sector 35-B Residential Grid, Chandigarh');
  const [pH, setPH] = useState(7.3);
  const [turbidity, setTurbidity] = useState(0.9);
  const [tds, setTds] = useState(155);
  const [chlorine, setChlorine] = useState(0.4);
  const [coliform, setColiform] = useState(0);
  const [issueSuccessMsg, setIssueSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    loadPassports();
    handleVerify('PASSPORT-PB-CHD-001');
  }, []);

  const loadPassports = async () => {
    const list = await fetchAllPassports();
    setPassports(list);
  };

  const handleVerify = async (query: string) => {
    setLoading(true);
    setSearchQuery(query);
    const result = await verifyPassport(query.trim());
    setVerification(result);
    setLoading(false);
  };

  const handleCopyLink = () => {
    if (verification?.passport) {
      navigator.clipboard.writeText(window.location.origin + `/passport?id=${verification.passport.passportId}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleIssueSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const created = await issuePassport({
      stationOrFacility: newFacility || 'MC Drinking Water Distribution Tanker #14',
      facilityType,
      location: locationName,
      certifiedBy: 'PPCB Regional Mobile Testing Cell',
      parameters: {
        pH: Number(pH),
        turbidity_ntu: Number(turbidity),
        tds_ppm: Number(tds),
        chlorine_ppm: Number(chlorine),
        coliform_cfu: Number(coliform)
      }
    });
    setLoading(false);
    setIssueSuccessMsg(`Cryptographic Water Passport ${created.passportId} committed to ledger!`);
    await loadPassports();
    setActiveTab('verify');
    handleVerify(created.passportId);
    setTimeout(() => setIssueSuccessMsg(null), 6000);
  };

  const currentPassport = verification?.passport;

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-[var(--background)]">
      {/* Top Header */}
      <header className="px-6 py-4 border-b border-zinc-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-zinc-900 tracking-tight">AquaTrust Cryptographic Water Passport</h1>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                <Lock className="w-2.5 h-2.5" /> SHA-256 Ledger
              </span>
            </div>
            <p className="text-xs text-zinc-500">Tamper-evident verification certificates for municipal waterworks, tankers & community grids</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-xl self-start md:self-auto">
          <button
            onClick={() => setActiveTab('verify')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'verify' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            Verify Passport
          </button>
          <button
            onClick={() => setActiveTab('ledger')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'ledger' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            Blockchain Ledger ({passports.length})
          </button>
          <button
            onClick={() => setActiveTab('issue')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'issue' ? 'bg-blue-600 text-white shadow-sm' : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" /> Issue Passport
          </button>
        </div>
      </header>

      {issueSuccessMsg && (
        <div className="mx-6 mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          {issueSuccessMsg}
        </div>
      )}

      <div className="p-6 max-w-6xl w-full mx-auto space-y-6">

        {/* TAB 1: VERIFY PASSPORT */}
        {activeTab === 'verify' && (
          <div className="space-y-6">
            {/* Search / Scan Box */}
            <div className="card !p-5 bg-white border border-zinc-200 rounded-2xl shadow-sm space-y-4">
              <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider block">
                Enter Passport ID, Block Number, or Cryptographic SHA-256 Hash
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="e.g. PASSPORT-PB-CHD-001 or 5e884898da28..."
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <button
                  onClick={() => handleVerify(searchQuery)}
                  disabled={loading}
                  className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold rounded-xl transition-colors shadow-sm disabled:opacity-50"
                >
                  {loading ? 'Verifying Proof...' : 'Verify Cryptographic Seal'}
                </button>
              </div>

              {/* Quick Select Preset Pills */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                <span className="text-zinc-400 font-medium">Verify Quick Stations:</span>
                {passports.map(p => (
                  <button
                    key={p.passportId}
                    onClick={() => handleVerify(p.passportId)}
                    className="px-2.5 py-1 bg-zinc-100 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 border border-zinc-200 rounded-lg text-[11px] font-mono text-zinc-700 transition-colors"
                  >
                    {p.passportId} ({p.stationOrFacility.split(' ')[0]})
                  </button>
                ))}
              </div>
            </div>

            {/* Verification Result Certificate Display */}
            {currentPassport ? (
              <div className="border-2 border-blue-500/30 rounded-3xl bg-gradient-to-b from-white via-blue-50/20 to-white shadow-xl overflow-hidden relative print:border-black print:shadow-none">
                {/* Security Holographic Top Banner */}
                <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-700 text-white px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                      <BadgeCheck className="w-6 h-6 text-emerald-300" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="font-bold text-base tracking-tight">Official Certificate of Water Purity</h2>
                        <span className="text-[10px] font-mono bg-white/20 px-2 py-0.5 rounded-full">
                          Block #{currentPassport.blockNumber}
                        </span>
                      </div>
                      <p className="text-xs text-blue-100">Punjab Pollution Control Board & MC Chandigarh Grid Authority</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyLink}
                      className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors print:hidden"
                      title="Copy Public Link"
                    >
                      <Copy className="w-3.5 h-3.5" /> {copied ? 'Copied!' : 'Share'}
                    </button>
                    <button
                      onClick={handlePrint}
                      className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors print:hidden"
                      title="Print Official PDF"
                    >
                      <Printer className="w-3.5 h-3.5" /> Print
                    </button>
                  </div>
                </div>

                <div className="p-8 space-y-8">
                  {/* Status & Facility Header */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-zinc-200">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">Certified Station / Entity</span>
                      <h3 className="text-2xl font-bold text-zinc-900 mt-0.5">{currentPassport.stationOrFacility}</h3>
                      <p className="text-xs text-zinc-600 mt-1">{currentPassport.location}</p>
                      <p className="text-[11px] text-zinc-400 mt-0.5">
                        Certified by: <span className="font-semibold text-zinc-700">{currentPassport.certifiedBy}</span> • Timestamp: {new Date(currentPassport.testedAt).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex flex-col items-start md:items-end gap-2">
                      <div className={`px-4 py-2 rounded-2xl border font-bold text-xs uppercase tracking-wide flex items-center gap-2 ${
                        currentPassport.complianceStatus === 'EXEMPLARY' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                          : currentPassport.complianceStatus === 'SAFE_BIS_10500'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : currentPassport.complianceStatus === 'REQUIRES_ACTION'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}>
                        <Sparkles className="w-4 h-4" />
                        {currentPassport.complianceStatus.replace(/_/g, ' ')}
                      </div>
                      <span className="text-[11px] font-mono text-zinc-500">
                        Passport ID: <span className="font-bold text-zinc-900">{currentPassport.passportId}</span>
                      </span>
                    </div>
                  </div>

                  {/* Certified Water Parameter Grid */}
                  <div>
                    <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">
                      Certified Chemical & Biological Parameters (BIS 10500:2012 Standard)
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200">
                        <span className="text-[11px] font-semibold text-zinc-500 block">pH Level</span>
                        <div className="text-xl font-bold font-mono text-zinc-900 mt-1">{currentPassport.parameters.pH}</div>
                        <span className="text-[10px] text-zinc-400">Acceptable: 6.5 - 8.5</span>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200">
                        <span className="text-[11px] font-semibold text-zinc-500 block">Turbidity</span>
                        <div className="text-xl font-bold font-mono text-zinc-900 mt-1">{currentPassport.parameters.turbidity_ntu} NTU</div>
                        <span className="text-[10px] text-zinc-400">Max limit: 1.0 - 5.0</span>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200">
                        <span className="text-[11px] font-semibold text-zinc-500 block">TDS</span>
                        <div className="text-xl font-bold font-mono text-zinc-900 mt-1">{currentPassport.parameters.tds_ppm} ppm</div>
                        <span className="text-[10px] text-zinc-400">Ideal: &lt; 300 ppm</span>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200">
                        <span className="text-[11px] font-semibold text-zinc-500 block">Free Chlorine</span>
                        <div className="text-xl font-bold font-mono text-zinc-900 mt-1">{currentPassport.parameters.chlorine_ppm} ppm</div>
                        <span className="text-[10px] text-zinc-400">Standard: 0.2 - 1.0</span>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200">
                        <span className="text-[11px] font-semibold text-zinc-500 block">Coliform Count</span>
                        <div className={`text-xl font-bold font-mono mt-1 ${currentPassport.parameters.coliform_cfu === 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {currentPassport.parameters.coliform_cfu} CFU/100ml
                        </div>
                        <span className="text-[10px] text-zinc-400">Requirement: 0 CFU</span>
                      </div>
                    </div>
                  </div>

                  {/* Cryptographic Ledger Verification Proof */}
                  <div className="p-5 rounded-2xl bg-zinc-900 text-zinc-200 space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-bold text-white uppercase tracking-wider">Cryptographic Chain of Custody</span>
                      </div>
                      <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> ZERO TAMPER DETECTED
                      </span>
                    </div>

                    <div className="space-y-2 text-xs font-mono">
                      <div>
                        <span className="text-zinc-500 block text-[10px] uppercase">SHA-256 Payload Hash:</span>
                        <span className="text-emerald-300 break-all select-all">{currentPassport.dataHash}</span>
                      </div>
                      <div>
                        <span className="text-zinc-500 block text-[10px] uppercase">Merkle Root:</span>
                        <span className="text-sky-300 break-all select-all">{currentPassport.merkleRoot}</span>
                      </div>
                      <div>
                        <span className="text-zinc-500 block text-[10px] uppercase">Previous Block Reference Hash:</span>
                        <span className="text-zinc-400 break-all">{currentPassport.previousBlockHash}</span>
                      </div>
                      <div>
                        <span className="text-zinc-500 block text-[10px] uppercase">Authority ECDSA Signature:</span>
                        <span className="text-indigo-300 break-all">{currentPassport.digitalSignature}</span>
                      </div>
                    </div>
                  </div>

                  {/* QR Verification Seal Footer */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-2">
                    <div className="flex items-center gap-4">
                      {/* Stylized QR Code Mock */}
                      <div className="w-20 h-20 rounded-xl bg-white p-2 border-2 border-zinc-300 shadow-sm flex flex-col items-center justify-center shrink-0">
                        <QrCode className="w-14 h-14 text-zinc-900" />
                        <span className="text-[8px] font-mono font-bold text-zinc-500">SCAN PROOF</span>
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-zinc-800">Public QR Verification Stamp</p>
                        <p className="text-[11px] text-zinc-500">Scan at point-of-use with any smartphone camera to inspect realtime lab validation.</p>
                        <a 
                          href={currentPassport.qrPayload}
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-[11px] text-blue-600 font-semibold hover:underline flex items-center gap-1 pt-1"
                        >
                          View public ledger record <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="inline-block p-3 rounded-2xl bg-zinc-100 border border-zinc-200 text-center">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">Consensus Standard</span>
                        <span className="text-xs font-bold text-zinc-800">IS 10500 : 2012 / WHO WQ</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="card !p-12 text-center bg-white border border-zinc-200 rounded-3xl">
                <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
                <h3 className="text-base font-bold text-zinc-800">Passport Not Found</h3>
                <p className="text-xs text-zinc-500 max-w-md mx-auto mt-1">
                  The provided Passport ID or hash could not be validated against the active ledger chain. Please check for typographical errors.
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: BLOCKCHAIN LEDGER EXPLORER */}
        {activeTab === 'ledger' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-zinc-900">Hydrology Trust Block Ledger</h2>
                <p className="text-xs text-zinc-500">Immutable chronological chain of validated water quality audits</p>
              </div>
              <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-lg bg-zinc-100 text-zinc-700">
                Network: Punjab & Chandigarh Hydrology Chain
              </span>
            </div>

            <div className="space-y-4">
              {passports.map(block => (
                <div 
                  key={block.passportId}
                  className="card !p-5 bg-white border border-zinc-200 rounded-2xl shadow-sm hover:border-blue-300 transition-all cursor-pointer space-y-3"
                  onClick={() => {
                    setActiveTab('verify');
                    handleVerify(block.passportId);
                  }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-zinc-900 text-white flex items-center justify-center font-mono text-xs font-bold">
                        #{block.blockNumber}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-zinc-900">{block.stationOrFacility}</h4>
                        <p className="text-[11px] text-zinc-500">{block.location}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        block.complianceStatus === 'EXEMPLARY' ? 'bg-emerald-100 text-emerald-800' :
                        block.complianceStatus === 'SAFE_BIS_10500' ? 'bg-blue-100 text-blue-800' :
                        'bg-rose-100 text-rose-800'
                      }`}>
                        {block.complianceStatus}
                      </span>
                      <span className="text-xs text-zinc-400 font-mono">
                        {new Date(block.testedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-zinc-50 rounded-xl font-mono text-[11px] text-zinc-600 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400">Passport ID:</span>
                      <span className="font-bold text-zinc-800">{block.passportId}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400">Block Hash:</span>
                      <span className="text-blue-600 truncate max-w-[280px] sm:max-w-md">{block.dataHash}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400">Authority Signature:</span>
                      <span className="text-zinc-500 truncate max-w-[280px] sm:max-w-md">{block.digitalSignature}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: ISSUE NEW PASSPORT */}
        {activeTab === 'issue' && (
          <div className="card !p-8 bg-white border border-zinc-200 rounded-3xl shadow-sm max-w-3xl mx-auto space-y-6">
            <div>
              <h2 className="text-lg font-bold text-zinc-900">Issue Cryptographic Water Passport</h2>
              <p className="text-xs text-zinc-500">Certify and commit a verified water sample reading into the tamper-proof ledger</p>
            </div>

            <form onSubmit={handleIssueSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-zinc-700 block mb-1">Facility / Source Name</label>
                  <input
                    type="text"
                    required
                    value={newFacility}
                    onChange={(e) => setNewFacility(e.target.value)}
                    placeholder="e.g. Sector 35-B Public School RO Unit"
                    className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-700 block mb-1">Facility Category</label>
                  <select
                    value={facilityType}
                    onChange={(e) => setFacilityType(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value="COMMERCIAL_TANKER">Commercial Drinking Water Tanker</option>
                    <option value="RESIDENTIAL_RO">Residential / Apartment RO System</option>
                    <option value="MUNICIPAL_WATERWORKS">Municipal Waterworks Outflow</option>
                    <option value="RESERVOIR">Open Watershed / Lake</option>
                    <option value="RURAL_TUBEWELL">Rural Deep Aquifer Tubewell</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">Geographic Location</label>
                <input
                  type="text"
                  required
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  placeholder="e.g. Sector 35-B, Chandigarh"
                  className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {/* Parameter Inputs */}
              <div>
                <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Tested Water Parameters</h4>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-zinc-600 block mb-1">pH</label>
                    <input
                      type="number"
                      step="0.01"
                      value={pH}
                      onChange={(e) => setPH(parseFloat(e.target.value))}
                      className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-zinc-600 block mb-1">Turbidity (NTU)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={turbidity}
                      onChange={(e) => setTurbidity(parseFloat(e.target.value))}
                      className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-zinc-600 block mb-1">TDS (ppm)</label>
                    <input
                      type="number"
                      value={tds}
                      onChange={(e) => setTds(parseInt(e.target.value))}
                      className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-zinc-600 block mb-1">Chlorine (ppm)</label>
                    <input
                      type="number"
                      step="0.05"
                      value={chlorine}
                      onChange={(e) => setChlorine(parseFloat(e.target.value))}
                      className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-zinc-600 block mb-1">Coliform (CFU)</label>
                    <input
                      type="number"
                      value={coliform}
                      onChange={(e) => setColiform(parseInt(e.target.value))}
                      className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-blue-500/20 disabled:opacity-50 flex items-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  {loading ? 'Calculating SHA-256...' : 'Sign & Commit to Ledger'}
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};

export default WaterPassportPage;
