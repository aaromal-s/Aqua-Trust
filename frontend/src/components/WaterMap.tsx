import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet default marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const stations = [
  { id: 'AQ-001', name: 'River North', lat: 51.505, lng: -0.09, status: 'safe', pH: 7.2, turbidity: 4.5 },
  { id: 'AQ-014', name: 'Lake East', lat: 51.51, lng: -0.1, status: 'warning', pH: 6.8, turbidity: 8.9 },
  { id: 'AQ-022', name: 'Estuary South', lat: 51.49, lng: -0.08, status: 'critical', pH: 5.5, turbidity: 15.2 },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'safe': return '#10b981';
    case 'warning': return '#f59e0b';
    case 'critical': return '#ef4444';
    default: return '#6b7280';
  }
};

const WaterMap = () => {
  return (
    <div className="w-full h-full min-h-[400px] rounded-xl overflow-hidden border border-[var(--border)] relative z-0">
      <MapContainer 
        center={[51.505, -0.09]} 
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        {stations.map((station) => (
          <React.Fragment key={station.id}>
            <Circle 
              center={[station.lat, station.lng]}
              radius={400}
              pathOptions={{ fillColor: getStatusColor(station.status), color: 'transparent', fillOpacity: 0.2 }}
            />
            <Marker position={[station.lat, station.lng]}>
              <Popup className="water-popup">
                <div className="p-1 min-w-[200px]">
                  <div className="flex items-center justify-between border-b border-gray-200 pb-2 mb-2">
                    <strong className="text-gray-800">{station.id} - {station.name}</strong>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold text-white bg-${station.status === 'safe' ? 'green' : station.status === 'warning' ? 'yellow' : 'red'}-500`}>
                      {station.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex justify-between"><span>pH Level:</span> <span className="font-semibold text-gray-900">{station.pH}</span></div>
                    <div className="flex justify-between"><span>Turbidity:</span> <span className="font-semibold text-gray-900">{station.turbidity} NTU</span></div>
                  </div>
                </div>
              </Popup>
            </Marker>
          </React.Fragment>
        ))}
      </MapContainer>
    </div>
  );
};

export default WaterMap;
