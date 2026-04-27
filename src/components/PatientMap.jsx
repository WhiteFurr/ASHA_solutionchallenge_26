import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';

const riskScore = (p) => {
  let s = 0;
  if (p.lastVisitDays > 14) s += 40;
  else if (p.lastVisitDays > 7) s += 20;
  else s += 5;
  if (['malnutrition','tb','postpartum'].includes(p.condition)) s += 50;
  else s += 10;
  return s;
};

const getColor = (p) => {
  if (p.visited) return '#1D9E75'; // green
  if (riskScore(p) >= 70) return '#E24B4A'; // red
  if (riskScore(p) >= 40) return '#EF9F27'; // orange
  return '#639922'; // light green
};

export default function PatientMap({ patients }) {
  return (
    <MapContainer
      center={[20.9042, 75.5621]} // Jalgaon
      zoom={12}
      style={{
        height: '420px',
        width: '100%',
        borderRadius: '12px',
        marginTop: '16px'
      }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {patients.map((p) => {
        if (!p.lat || !p.lng) return null;

        return (
          <CircleMarker
            key={p.id}
            center={[p.lat, p.lng]}
            radius={8}
            pathOptions={{
              color: 'white',
              weight: 2,
              fillColor: getColor(p),
              fillOpacity: 1,
            }}
          >
            <Popup>
              <div style={{ fontFamily: 'sans-serif' }}>
                <strong>{p.name}</strong><br/>
                {p.condition}<br/>
                {p.lastVisitDays} days ago<br/>
                <span style={{ fontWeight: '600', color: getColor(p) }}>
                  {p.visited ? '✓ Visited' : (riskScore(p)>=70 ? 'HIGH RISK' : 'Pending')}
                </span>
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}