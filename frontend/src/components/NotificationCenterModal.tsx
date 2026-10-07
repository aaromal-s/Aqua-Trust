import { useState, useEffect } from 'react';
import { 
  Bell, 
  X, 
  CheckCircle2, 
  Volume2, 
  Send, 
  Radio, 
  Smartphone, 
  Mail, 
  Globe 
} from 'lucide-react';
import { 
  fetchBroadcastAlerts, 
  subscribeToLocality, 
  requestBrowserPushPermission, 
  playAlertChime, 
  triggerSystemNotification, 
  getStoredSubscription, 
  type BroadcastAlert 
} from '../services/notificationService';

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationCenterModal = ({ isOpen, onClose }: NotificationCenterModalProps) => {
  const [activeTab, setActiveTab] = useState<'advisories' | 'subscribe'>('advisories');
  const [alerts, setAlerts] = useState<BroadcastAlert[]>([]);
  const [permission, setPermission] = useState<NotificationPermission>(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );

  // Subscription Form State
  const [subscriberName, setSubscriberName] = useState('');
  const [locality, setLocality] = useState('Sector 35-B Chandigarh');
  const [contactInfo, setContactInfo] = useState('');
  const [pushEnabled, setPushEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(false);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [categories, setCategories] = useState<string[]>(['CRITICAL_SPIKE', 'BOIL_WATER_ADVISORY']);
  const [subSuccess, setSubSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadAlerts();
      const existing = getStoredSubscription();
      if (existing) {
        setSubscriberName(existing.subscriberName);
        setLocality(existing.locality);
        setContactInfo(existing.contactInfo);
        setPushEnabled(existing.notifyChannels.browserPush);
        setSmsEnabled(existing.notifyChannels.sms);
        setEmailEnabled(existing.notifyChannels.email);
        setCategories(existing.subscribedCategories);
      }
    }
  }, [isOpen]);

  const loadAlerts = async () => {
    const list = await fetchBroadcastAlerts();
    setAlerts(list);
  };

  const handleRequestPush = async () => {
    const perm = await requestBrowserPushPermission();
    setPermission(perm);
    if (perm === 'granted') {
      triggerSystemNotification('AquaTrust Notifications Active', {
        body: `You are now receiving instant water safety alerts for ${locality}.`
      });
    }
  };

  const handleTestSound = () => {
    playAlertChime();
  };

  const toggleCategory = (cat: string) => {
    setCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
  };

  const handleSubscribeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await subscribeToLocality({
      subscriberName,
      locality,
      contactInfo,
      notifyChannels: { browserPush: pushEnabled, sms: smsEnabled, email: emailEnabled },
      subscribedCategories: categories
    });
    setSubSuccess(true);
    playAlertChime();
    setTimeout(() => {
      setSubSuccess(false);
      setActiveTab('advisories');
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border border-zinc-200 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-zinc-200 bg-zinc-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-900 leading-tight">Locality Water Alert Center</h2>
              <p className="text-xs text-zinc-500">Real-time environmental advisories & neighborhood subscriptions</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleTestSound}
              className="p-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-600 text-xs font-semibold flex items-center gap-1 transition-colors"
              title="Test Alert Chime"
            >
              <Volume2 className="w-3.5 h-3.5" /> Test Sound
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-zinc-200 text-zinc-400 hover:text-zinc-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-zinc-200 px-6 pt-3 gap-4 bg-white">
          <button
            onClick={() => setActiveTab('advisories')}
            className={`pb-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'advisories' ? 'border-blue-600 text-blue-600' : 'border-transparent text-zinc-500 hover:text-zinc-800'
            }`}
          >
            Active Advisories ({alerts.length})
          </button>
          <button
            onClick={() => setActiveTab('subscribe')}
            className={`pb-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'subscribe' ? 'border-blue-600 text-blue-600' : 'border-transparent text-zinc-500 hover:text-zinc-800'
            }`}
          >
            Locality Subscriptions
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {subSuccess && (
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              Subscribed! You will receive instant notifications when telemetry thresholds deviate in {locality}.
            </div>
          )}

          {activeTab === 'advisories' ? (
            <div className="space-y-3">
              {alerts.map(alert => (
                <div 
                  key={alert.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    alert.severity === 'CRITICAL' ? 'bg-rose-50/70 border-rose-200' :
                    alert.severity === 'WARNING' ? 'bg-amber-50/70 border-amber-200' : 'bg-blue-50/50 border-blue-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono font-bold text-zinc-500">{alert.id} • {alert.locality}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      alert.severity === 'CRITICAL' ? 'bg-rose-100 text-rose-800' :
                      alert.severity === 'WARNING' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {alert.severity}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-zinc-900 mb-1">{alert.title}</h4>
                  <p className="text-xs text-zinc-600 mb-3">{alert.message}</p>

                  <div className="p-2.5 rounded-xl bg-white/80 border border-black/5 text-[11px] text-zinc-700">
                    <span className="font-bold text-zinc-800">Action Required: </span>
                    {alert.recommendedAction}
                  </div>

                  <div className="mt-2 text-[10px] text-zinc-400 text-right">
                    Issued: {new Date(alert.issuedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Valid for {alert.expiresInHours}h
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <form onSubmit={handleSubscribeSubmit} className="space-y-4">
              {permission !== 'granted' && (
                <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-indigo-900 font-semibold">
                    <Radio className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>Enable native browser push notifications for zero-delay alerts</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleRequestPush}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-colors shadow-sm"
                  >
                    Allow Push
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-zinc-700 block mb-1">Subscriber / Household Name</label>
                  <input
                    type="text"
                    required
                    value={subscriberName}
                    onChange={(e) => setSubscriberName(e.target.value)}
                    placeholder="e.g. Gurpreet Singh / Sector 35 RWA"
                    className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-700 block mb-1">Target Locality / Watershed</label>
                  <select
                    value={locality}
                    onChange={(e) => setLocality(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value="Sector 35-B Chandigarh">Sector 35-B Chandigarh Residential</option>
                    <option value="Sukhna Lake Watershed">Sukhna Lake Watershed & Sector 1</option>
                    <option value="Kajauli Waterworks Phase IV">Kajauli Waterworks Phase IV (Sector 39 Grid)</option>
                    <option value="Ludhiana Industrial Basin">Ludhiana Industrial & Budha Nullah Basin</option>
                    <option value="Harike Wetland Sanctuary">Harike Pattan Wetland (Tarn Taran)</option>
                    <option value="Bathinda Malwa Deep Aquifer">Bathinda Malwa Deep Aquifer Zone</option>
                    <option value="All Punjab & Chandigarh Grid">All Punjab & Chandigarh Grid Stations</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">Email / Phone Contact</label>
                <input
                  type="text"
                  required
                  value={contactInfo}
                  onChange={(e) => setContactInfo(e.target.value)}
                  placeholder="e.g. resident@gmail.com or +91 98765 43210"
                  className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {/* Delivery Channels */}
              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-2">Delivery Channels</label>
                <div className="grid grid-cols-3 gap-2">
                  <label className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                    pushEnabled ? 'bg-blue-50 border-blue-300 text-blue-900 font-bold' : 'bg-zinc-50 border-zinc-200 text-zinc-600'
                  }`}>
                    <input type="checkbox" checked={pushEnabled} onChange={(e) => setPushEnabled(e.target.checked)} className="hidden" />
                    <Globe className="w-3.5 h-3.5" />
                    <span className="text-xs">Web Push</span>
                  </label>

                  <label className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                    smsEnabled ? 'bg-blue-50 border-blue-300 text-blue-900 font-bold' : 'bg-zinc-50 border-zinc-200 text-zinc-600'
                  }`}>
                    <input type="checkbox" checked={smsEnabled} onChange={(e) => setSmsEnabled(e.target.checked)} className="hidden" />
                    <Smartphone className="w-3.5 h-3.5" />
                    <span className="text-xs">SMS Broadcast</span>
                  </label>

                  <label className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                    emailEnabled ? 'bg-blue-50 border-blue-300 text-blue-900 font-bold' : 'bg-zinc-50 border-zinc-200 text-zinc-600'
                  }`}>
                    <input type="checkbox" checked={emailEnabled} onChange={(e) => setEmailEnabled(e.target.checked)} className="hidden" />
                    <Mail className="w-3.5 h-3.5" />
                    <span className="text-xs">Email Digest</span>
                  </label>
                </div>
              </div>

              {/* Category Checkboxes */}
              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-2">Notification Categories</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { id: 'CRITICAL_SPIKE', label: 'TDS & Heavy Metals Spikes' },
                    { id: 'BOIL_WATER_ADVISORY', label: 'Boil Water & Health Advisories' },
                    { id: 'PIPE_FLUSH_NOTICE', label: 'Scheduled Municipal Line Flushing' },
                    { id: 'SAFE_RESTORED', label: 'Safe Quality Restoration Notices' },
                  ].map(cat => (
                    <label key={cat.id} className="flex items-center gap-2 p-2 rounded-xl bg-zinc-50 border border-zinc-200 cursor-pointer text-zinc-700">
                      <input
                        type="checkbox"
                        checked={categories.includes(cat.id)}
                        onChange={() => toggleCategory(cat.id)}
                        className="w-4 h-4 accent-blue-600 rounded"
                      />
                      <span>{cat.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-blue-500/20 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" /> Save Subscription Preferences
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationCenterModal;
