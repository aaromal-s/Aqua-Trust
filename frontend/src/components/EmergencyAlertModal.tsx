import { useState } from 'react';
import { Bell, ShieldCheck, X, CheckCircle2, Phone, Mail, MapPin } from 'lucide-react';

interface EmergencyAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultZone?: string;
}

export const EmergencyAlertModal = ({ isOpen, onClose, defaultZone = 'Sector 4 - Residential' }: EmergencyAlertModalProps) => {
  const [method, setMethod] = useState<'sms' | 'email'>('sms');
  const [contact, setContact] = useState('');
  const [zone, setZone] = useState(defaultZone);
  const [frequency, setFrequency] = useState<'critical' | 'all'>('critical');
  const [isSubscribed, setIsSubscribed] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubscribed(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/50 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden relative animate-spring-up">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50/40 border-b border-zinc-100 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-zinc-900">Community Water Alerts</h3>
              <p className="text-xs text-zinc-500">Get instant SMS or Email boil-water advisories</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isSubscribed ? (
            <div className="text-center py-6">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-zinc-900 mb-1">Alerts Activated!</h4>
              <p className="text-sm text-zinc-600 mb-6">
                You are now registered for emergency advisories in <strong className="text-zinc-900">{zone}</strong>. We've sent a confirmation to <span className="font-mono text-xs bg-zinc-100 px-2 py-1 rounded text-zinc-800">{contact}</span>.
              </p>
              <button
                onClick={() => {
                  setIsSubscribed(false);
                  onClose();
                }}
                className="w-full py-2.5 rounded-xl bg-zinc-900 text-white text-sm font-semibold hover:bg-zinc-800 transition-colors"
              >
                Close & Return
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Locality Selection */}
              <div>
                <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1.5">
                  Monitoring Zone
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <select 
                    value={zone} 
                    onChange={(e) => setZone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value="Sector 4 - Residential">Sector 4 - Residential Supply</option>
                    <option value="94103 - Bay Area / Downtown">94103 - Bay Area / Downtown</option>
                    <option value="North River Basin">North River Basin</option>
                    <option value="Lake East District">Lake East District</option>
                    <option value="Estuary South Aquifer">Estuary South Aquifer</option>
                  </select>
                </div>
              </div>

              {/* Delivery Mode Toggle */}
              <div>
                <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1.5">
                  Notification Channel
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setMethod('sms')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border transition-all ${
                      method === 'sms' 
                        ? 'bg-blue-50 border-blue-300 text-blue-700 shadow-sm' 
                        : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                    }`}
                  >
                    <Phone className="w-3.5 h-3.5" /> SMS / WhatsApp
                  </button>
                  <button
                    type="button"
                    onClick={() => setMethod('email')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border transition-all ${
                      method === 'email' 
                        ? 'bg-blue-50 border-blue-300 text-blue-700 shadow-sm' 
                        : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5" /> Email
                  </button>
                </div>
              </div>

              {/* Contact Input */}
              <div>
                <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1.5">
                  {method === 'sms' ? 'Mobile Phone Number' : 'Email Address'}
                </label>
                <input
                  required
                  type={method === 'sms' ? 'tel' : 'email'}
                  placeholder={method === 'sms' ? '+1 (555) 234-5678' : 'resident@domain.com'}
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {/* Frequency selection */}
              <div>
                <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1.5">
                  Alert Severity
                </label>
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-xs text-zinc-700 cursor-pointer">
                    <input 
                      type="radio" 
                      name="frequency" 
                      checked={frequency === 'critical'} 
                      onChange={() => setFrequency('critical')}
                      className="text-blue-600"
                    />
                    <span><strong>Critical Only:</strong> Boil water & chemical hazard advisories</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs text-zinc-700 cursor-pointer">
                    <input 
                      type="radio" 
                      name="frequency" 
                      checked={frequency === 'all'} 
                      onChange={() => setFrequency('all')}
                      className="text-blue-600"
                    />
                    <span><strong>All Updates:</strong> Includes weekly water health reports</span>
                  </label>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" /> Subscribe for Free Alerts
                </button>
              </div>

              <p className="text-[11px] text-zinc-400 text-center">
                Zero spam. You can unsubscribe at any time via SMS reply or link.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
export default EmergencyAlertModal;
