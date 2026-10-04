import { useState, Fragment } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Droplets, Waves, AlertTriangle, Filter } from 'lucide-react';

// Fix Leaflet default marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapPoint {
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
  { id: 'AQ-001', name: 'River North Aqueduct', category: 'sensor', lat: 51.505, lng: -0.09, status: 'safe', details: 'Continuous municipal sensor telemetry', pH: 7.2, turbidity: 4.5, extraInfo: 'Drinkable: Yes' },
  { id: 'AQ-014', name: 'Lake East Main Sensor', category: 'sensor', lat: 51.51, lng: -0.1, status: 'warning', details: 'High mineral activity detected', pH: 6.8, turbidity: 8.9, extraInfo: 'Drinkable: Boil first' },
  { id: 'AQ-022', name: 'Estuary South Drainage', category: 'sensor', lat: 51.49, lng: -0.08, status: 'critical', details: 'Elevated chemical runoff', pH: 5.5, turbidity: 15.2, extraInfo: 'Drinkable: No' },
  
  // Public Drinking Water & Refill Stations
  { id: 'REF-01', name: 'City Hall Public Refill Fountain', category: 'drinking_station', lat: 51.508, lng: -0.085, status: 'safe', details: 'Free UV-purified chilled tap water', extraInfo: '14,200 plastic bottles saved' },
  { id: 'REF-02', name: 'Metro Plaza Water ATM', category: 'drinking_station', lat: 51.502, lng: -0.095, status: 'safe', details: 'Reverse Osmosis public refill kiosk', extraInfo: '9,840 plastic bottles saved' },
  
  // Recreational Water (Swimming / Boating)
  { id: 'REC-01', name: 'Lake East Public Beach & Pier', category: 'recreational', lat: 51.514, lng: -0.098, status: 'safe', details: 'Safe for open water swimming and paddle boarding', extraInfo: 'Bacterial counts: Safe' },
  { id: 'REC-02', name: 'Pine Creek Canoe Launch', category: 'recreational', lat: 51.495, lng: -0.105, status: 'warning', details: 'Caution: Moderate turbidity after rainfall', extraInfo: 'Life jackets recommended' },
  
  // Citizen Hazard Sighting
  { id: 'HAZ-01', name: 'South Canal Debris Sighting', category: 'hazard', lat: 51.492, lng: -0.075, status: 'critical', details: 'Reported by citizen #AQUA-1039: Iridescent oily sheen', extraInfo: 'Municipal cleanup dispatched' }
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

  const filteredPoints = activeFilter === 'all' 
    ? mapPoints 
    : mapPoints.filter(p => p.category === activeFilter);

  return (
    <div className="w-full h-full min-h-[440px] flex flex-col rounded-xl overflow-hidden border border-zinc-200 bg-white relative z-0">
      
      {/* Interactive Public Filter Bar */}
      <div className="p-3 bg-white/90 backdrop-blur-md border-b border-zinc-200 flex flex-wrap items-center justify-between gap-2 z-10">
        <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-700">
          <Filter className="w-3.5 h-3.5 text-zinc-500" />
          <span>Community Map View:</span>
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
            <Droplets className="w-3.5 h-3.5" /> Clean Refill Stations
          </button>

          <button
            onClick={() => setActiveFilter('recreational')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
              activeFilter === 'recreational'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
            }`}
          >
            <Waves className="w-3.5 h-3.5" /> Swimming & Lakes
          </button>

          <button
            onClick={() => setActiveFilter('hazard')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
              activeFilter === 'hazard'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" /> Reported Hazards
          </button>
        </div>
      </div>

      {/* Leaflet Map */}
      <div className="flex-1 w-full relative z-0">
        <MapContainer 
          center={[51.505, -0.09]} 
          zoom={13} 
          style={{ height: '100%', width: '100%' }}
          className="z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          
          {filteredPoints.map((point) => (
            <Fragment key={point.id}>
              <Circle 
                center={[point.lat, point.lng]}
                radius={350}
                pathOptions={{ fillColor: getStatusColor(point.status), color: 'transparent', fillOpacity: 0.25 }}
              />
              <Marker position={[point.lat, point.lng]}>
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

    </div>
  );
};

export default WaterMap;
