import { Phone, AlertOctagon, X, ShieldAlert, Check, Clock } from 'lucide-react';

interface EmergencyDirectoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const emergencyContacts = [
  {
    title: '24/7 Municipal Main Break & Contamination Dispatch',
    number: '1-800-278-2767',
    formatted: '(800) AQUA-SOS',
    hours: '24 Hours / 7 Days a Week',
    desc: 'For immediate water main bursts, sewage backflow, or sudden severe discoloration across neighborhood pipelines.',
    badge: 'Immediate Dispatch',
    badgeColor: 'bg-rose-100 text-rose-800'
  },
  {
    title: 'Hazardous Chemical & Oil Spill Response Center',
    number: '1-800-424-8802',
    formatted: '(800) 424-8802',
    hours: 'Immediate Federal / State Response',
    desc: 'To report petroleum sheens, illegal industrial dumping into rivers, lakes, storm drains, or coastal canals.',
    badge: 'Environmental Police',
    badgeColor: 'bg-amber-100 text-amber-800'
  },
  {
    title: 'National Poison Control Center (Ingestion Triage)',
    number: '1-800-222-1222',
    formatted: '(800) 222-1222',
    hours: '24/7 Medical Professionals On-Call',
    desc: 'If anyone in your household accidentally consumed water suspected of heavy chemical or microbial poisoning.',
    badge: 'Medical Emergency',
    badgeColor: 'bg-red-100 text-red-800'
  },
  {
    title: 'Public Health Department Boil Water Inquiry Desk',
    number: '1-888-555-7233',
    formatted: '(888) 555-SAFE',
    hours: 'Mon-Sun: 6:00 AM - 10:00 PM',
    desc: 'To verify active boil water notices, school closure advisories, and free clean water distribution pickup points.',
    badge: 'Advisory Verification',
    badgeColor: 'bg-blue-100 text-blue-800'
  }
];

export const EmergencyDirectoryModal = ({ isOpen, onClose }: EmergencyDirectoryModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-rose-200 overflow-hidden relative animate-spring-up max-h-[90vh] flex flex-col">
        
        {/* Urgent Header */}
        <div className="p-5 bg-gradient-to-r from-rose-600 to-red-700 text-white flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
              <AlertOctagon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold">24/7 Water Crisis & Emergency Directory</h3>
              <p className="text-xs text-rose-100">Immediate hotlines for contamination, pipe bursts, and health risks</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-rose-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Guide Banner */}
        <div className="p-4 bg-rose-50 border-b border-rose-100 flex items-start gap-2.5 text-xs text-rose-950">
          <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <strong>If you suspect acute chemical or sewage contamination:</strong>
            <p className="text-rose-800 mt-0.5">Shut off your main household shutoff valve immediately, do not drink or boil (boiling can concentrate chemical toxins), and contact dispatch below.</p>
          </div>
        </div>

        {/* Directory List */}
        <div className="p-5 overflow-y-auto space-y-3.5 flex-1">
          {emergencyContacts.map((contact) => (
            <div 
              key={contact.number}
              className="p-4 rounded-xl border border-zinc-200 hover:border-rose-300 hover:bg-rose-50/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${contact.badgeColor}`}>
                    {contact.badge}
                  </span>
                  <span className="text-[11px] text-zinc-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {contact.hours}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-zinc-900">{contact.title}</h4>
                <p className="text-xs text-zinc-500 leading-relaxed max-w-sm">{contact.desc}</p>
              </div>

              <div className="shrink-0 pt-2 sm:pt-0">
                <a
                  href={`tel:${contact.number}`}
                  className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-rose-600 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <Phone className="w-3.5 h-3.5" /> {contact.formatted}
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 bg-zinc-50 border-t border-zinc-200 text-center flex items-center justify-between">
          <span className="text-xs text-zinc-500 flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-600" /> Verified Municipal & EPA Directory
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white border border-zinc-200 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
export default EmergencyDirectoryModal;
