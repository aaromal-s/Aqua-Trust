import { useState, Fragment } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Droplets, Waves, AlertTriangle, Filter, List, Map as MapIcon } from 'lucide-react';

// High-performance vector DivIcon for Leaflet markers
const createCustomMarkerIcon = (status: 'safe' | 'warning' | 'critical') => {
  const bg = status === 'safe' ? '#10b981' : status === 'warning' ? '#f59e0b' : '#ef4444';
  const ring = status === 'safe' ? 'rgba(16, 185, 129, 0.35)' : status === 'warning' ? 'rgba(245, 158, 11, 0.35)' : 'rgba(239, 68, 68, 0.45)';
  const ping = status === 'critical' ? '<div style="position: absolute; inset: 0; border-radius: 9999px; background-color: ' + bg + '; opacity: 0.7; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>' : '';

  return L.divIcon({
    className: 'custom-water-marker-icon',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -16],
    html: `
      <div style="position: relative; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;">
        ${ping}
        <div style="position: absolute; inset: 0; border-radius: 9999px; background-color: ${ring};"></div>
        <div style="position: relative; width: 18px; height: 18px; border-radius: 9999px; background-color: ${bg}; border: 2.5px solid #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.25); display: flex; align-items: center; justify-content: center;">
          <div style="width: 5px; height: 5px; border-radius: 9999px; background-color: #ffffff;"></div>
        </div>
      </div>
    `
  });
};

export interface MapPoint {
  id: string;
  name: string;
  category: 'sensor' | 'drinking_station' | 'recreational' | 'hazard';
  lat: number;
  lng: number;
  status: 'safe' | 'warning' | 'critical';
  details: string;
  pH?: number;
  turbidity?: number;
  extraInfo?: string;
}

const mapPoints: MapPoint[] = [
  // Sensors
  { id: 'AQ-001', name: 'Sukhna Lake (Sector 1, Chandigarh)', category: 'sensor', lat: 30.7421, lng: 76.8188, status: 'safe', details: 'Continuous watershed & reservoir monitoring fed by Shivalik streams.', pH: 7.4, turbidity: 2.1, extraInfo: 'Drinkable: With municipal treatment' },
  { id: 'AQ-014', name: 'Kajauli Waterworks Line (Sector 39)', category: 'sensor', lat: 30.7300, lng: 76.7410, status: 'safe', details: 'Bhakra canal drinking supply pipeline for Chandigarh & Mohali grid.', pH: 7.2, turbidity: 1.2, extraInfo: 'Drinkable: 100% BIS 10500 Compliant' },
  { id: 'AQ-022', name: 'N-Choe Rivulet (Sector 42 Ecological Zone)', category: 'sensor', lat: 30.7250, lng: 76.7620, status: 'warning', details: 'Seasonal stormwater rivulet passing through southern Chandigarh sectors.', pH: 6.8, turbidity: 6.8, extraInfo: 'Ecological corridor: Non-potable' },
  { id: 'AQ-035', name: 'Budha Nullah Inflow (Ludhiana Industrial Zone)', category: 'sensor', lat: 30.9120, lng: 75.8350, status: 'critical', details: 'PPCB Alert: High textile dyeing and chemical effluent near Sutlej confluence.', pH: 5.2, turbidity: 22.4, extraInfo: 'Critical Hazard: Direct contact prohibited' },
  { id: 'AQ-040', name: 'Harike Pattan Wetland Sanctuary (Punjab)', category: 'sensor', lat: 31.1500, lng: 74.9500, status: 'safe', details: 'Ramsar International Wetland at Beas-Sutlej river confluence.', pH: 7.6, turbidity: 3.4, extraInfo: 'Indus Dolphin Habitat: Safe' },
  
  // Public Drinking Water & Refill Stations
  { id: 'REF-01', name: 'Sector 17 Plaza Public Water ATM (Chandigarh)', category: 'drinking_station', lat: 30.7398, lng: 76.7827, status: 'safe', details: 'Municipal Corporation 4-stage RO chilled public drinking water kiosk.', extraInfo: '18,400 plastic bottles saved' },
  { id: 'REF-02', name: 'ISBT Sector 43 Water ATM Kiosk', category: 'drinking_station', lat: 30.7180, lng: 76.7490, status: 'safe', details: 'High-capacity UV-purified free tap refill for interstate travelers.', extraInfo: '12,850 plastic bottles saved' },
  
  // Recreational Water (Swimming / Boating)
  { id: 'REC-01', name: 'Sukhna Lake Boating & Promenade Pier', category: 'recreational', lat: 30.7445, lng: 76.8140, status: 'safe', details: 'Designated safe recreational waters for rowing, kayaking, and tourism.', extraInfo: 'Recreational Health: Optimal' },
  { id: 'REC-02', name: 'Ropar Wetland Eco-Reserve (Sutlej Bank)', category: 'recreational', lat: 30.9700, lng: 76.5300, status: 'safe', details: 'Protected freshwater wetland and migratory waterfowl sanctuary.', extraInfo: 'Bacterial counts: Safe' },
  
  // Citizen Hazard Sighting
  { id: 'HAZ-01', name: 'Ghaggar River Effluent Sighting (Near Dera Bassi)', category: 'hazard', lat: 30.5850, lng: 76.8400, status: 'critical', details: 'Reported by citizen #AQUA-1039: Frothing chemical discharge observed.', extraInfo: 'PPCB field inspection team dispatched' }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'safe': return '#10b981';
    case 'warning': return '#f59e0b';
    case 'critical': return '#ef4444';
    default: return '#3b82f6';
  }
};

export const WaterMap = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'drinking_station' | 'recreational' | 'hazard'>('all');
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');

  const filteredPoints = activeFilter === 'all' 
    ? mapPoints 
    : mapPoints.filter(p => p.category === activeFilter);

  return (
    <div className="w-full h-full min-h-[440px] flex flex-col rounded-xl overflow-hidden border border-zinc-200 bg-white relative z-0">
      
      {/* Interactive Public Filter Bar */}
      <div className="p-3 bg-white/95 backdrop-blur-md border-b border-zinc-200 flex flex-wrap items-center justify-between gap-2 z-10 shadow-sm">
        <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-700">
          <Filter className="w-3.5 h-3.5 text-blue-600" />
          <span>Hydrology View:</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              activeFilter === 'all'
                ? 'bg-zinc-900 text-white shadow-sm'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
            }`}
          >
            All Points ({mapPoints.length})
          </button>
          
          <button
            onClick={() => setActiveFilter('drinking_station')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
              activeFilter === 'drinking_station'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
            }`}
          >
            <Droplets className="w-3.5 h-3.5" /> Clean Water ATMs
          </button>

          <button
            onClick={() => setActiveFilter('recreational')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
              activeFilter === 'recreational'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
            }`}
          >
            <Waves className="w-3.5 h-3.5" /> Lakes & Reserves
          </button>

          <button
            onClick={() => setActiveFilter('hazard')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
              activeFilter === 'hazard'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" /> Active Hazards
          </button>

          {/* Mode Switcher */}
          <div className="ml-auto pl-2 border-l border-zinc-200 flex items-center gap-1">
            <button
              onClick={() => setViewMode('map')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${viewMode === 'map' ? 'bg-zinc-900 text-white' : 'text-zinc-500 hover:bg-zinc-100'}`}
              title="Interactive Map"
            >
              <MapIcon className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${viewMode === 'list' ? 'bg-zinc-900 text-white' : 'text-zinc-500 hover:bg-zinc-100'}`}
              title="Station Table"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Container: Map or List */}
      {viewMode === 'map' ? (
        <div className="flex-1 w-full relative z-0">
          <MapContainer 
            center={[30.7333, 76.7794]} 
            zoom={12} 
            scrollWheelZoom={false}
            style={{ height: '100%', width: '100%' }}
            className="z-0"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {filteredPoints.map((point) => (
              <Fragment key={point.id}>
                <Circle 
                  center={[point.lat, point.lng]}
                  radius={350}
                  pathOptions={{ fillColor: getStatusColor(point.status), color: 'transparent', fillOpacity: 0.25 }}
                />
                <Marker position={[point.lat, point.lng]} icon={createCustomMarkerIcon(point.status)}>
                  <Popup className="water-popup">
                    <div className="p-1 min-w-[220px]">
                      <div className="flex items-center justify-between border-b border-zinc-200 pb-2 mb-2">
                        <strong className="text-zinc-900 text-xs font-bold">{point.name}</strong>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase ${
                          point.status === 'safe' ? 'bg-emerald-600' : point.status === 'warning' ? 'bg-amber-500' : 'bg-rose-600'
                        }`}>
                          {point.status}
                        </span>
                      </div>

                      <p className="text-xs text-zinc-600 mb-2 leading-relaxed">{point.details}</p>

                      {point.pH !== undefined && point.turbidity !== undefined && (
                        <div className="space-y-1 text-xs text-zinc-500 bg-zinc-50 p-2 rounded border border-zinc-100 mb-2">
                          <div className="flex justify-between"><span>pH:</span> <span className="font-semibold text-zinc-900">{point.pH}</span></div>
                          <div className="flex justify-between"><span>Turbidity:</span> <span className="font-semibold text-zinc-900">{point.turbidity} NTU</span></div>
                        </div>
                      )}

                      {point.extraInfo && (
                        <div className="text-[11px] font-semibold text-blue-600 flex items-center gap-1">
                          ★ {point.extraInfo}
                        </div>
                      )}
                    </div>
                  </Popup>
                </Marker>
              </Fragment>
            ))}
          </MapContainer>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-4 bg-zinc-50/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredPoints.map((point) => (
              <div key={point.id} className="p-4 bg-white rounded-xl border border-zinc-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h4 className="text-xs font-bold text-zinc-900">{point.name}</h4>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase shrink-0 ${
                      point.status === 'safe' ? 'bg-emerald-600' : point.status === 'warning' ? 'bg-amber-500' : 'bg-rose-600'
                    }`}>
                      {point.status}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 mb-2">{point.details}</p>
                </div>

                <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-600">
                  <span>ID: <strong className="font-mono">{point.id}</strong></span>
                  {point.extraInfo && <span className="text-blue-600 font-semibold">{point.extraInfo}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default WaterMap;
