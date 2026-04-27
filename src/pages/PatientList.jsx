import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import PatientMap from '../components/PatientMap';
import StatCards from '../components/StatCards';

// --- Reuse your Risk Logic ---
const riskScore = (p) => {
  let score = 0;
  if (p.lastVisitDays > 14) score += 40;
  else if (p.lastVisitDays > 7) score += 20;
  else score += 5;
  if (['malnutrition', 'tb', 'postpartum'].includes(p.condition)) score += 50;
  else score += 10;
  return score;
};

const riskLabel = (p) => {
  const s = riskScore(p);
  if (s >= 70) return { label: 'HIGH', bg: '#FCEBEB', color: '#A32D2D' };
  if (s >= 40) return { label: 'MEDIUM', bg: '#FAEEDA', color: '#854F0B' };
  return { label: 'LOW', bg: '#EAF3DE', color: '#3B6D11' };
};

export default function PatientList() {
  const { ashaId, regionId } = useParams(); // Get ID from URL
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPatients = patients.filter((p) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;
    const label = riskLabel(p).label.toLowerCase();
    const text = `${p.name || ''} ${p.condition || ''} ${label} ${p.visited ? 'visited' : 'pending'}`.toLowerCase();
    return text.includes(query);
  });

  useEffect(() => {
    // 🔥 THE FILTER: Only fetch patients matching this ASHA's region
    const q = query(collection(db, 'patients'), where('regionId', '==', regionId));
    
    const unsub = onSnapshot(q, (snap) => {
      let data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      data.sort((a, b) => riskScore(b) - riskScore(a));
      setPatients(data);
    });
    return unsub;
  }, [regionId]);

  return (
    <div>
      <button onClick={() => navigate('/')} style={backBtn}>← Back to ASHAs</button>
      
      <h1 style={{ marginTop: '16px', color: '#1a1a1a', fontSize: '2rem' }}>Region: {regionId}</h1>
      <p style={{ color: '#4a4a4a', marginTop: '8px', fontSize: '1rem', lineHeight: '1.6' }}>Monitoring patients assigned to ASHA ID: {ashaId}</p>

      <StatCards patients={patients} />

      <div style={searchRow}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by patient name, condition, criticalness..."
          style={searchInput}
        />
        <span style={searchHint}>{filteredPatients.length} result{filteredPatients.length === 1 ? '' : 's'}</span>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '24px' }}>
        <thead>
          <tr style={{ background: '#f5f5f5' }}>
            <th style={th}>Risk</th>
            <th style={th}>Name</th>
            <th style={th}>Condition</th>
            <th style={th}>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredPatients.length > 0 ? filteredPatients.map(p => {
            const risk = riskLabel(p);
            return (
              <tr 
                key={p.id} 
                onClick={() => navigate(`/patient/${p.id}`)} // Click to see AI reports
                style={{ cursor: 'pointer', borderBottom: '1px solid #eee' }}
              >
                <td style={td}>
                  <span style={{ ...badge, background: risk.bg, color: risk.color }}>{risk.label}</span>
                </td>
                <td style={td}><strong>{p.name}</strong></td>
                <td style={td}>{p.condition}</td>
                <td style={td}>
                  <span style={p.visited ? visitedStatus : pendingStatus}>
                    {p.visited ? 'Visited' : 'Pending'}
                  </span>
                </td>
              </tr>
            );
          }) : (
            <tr>
              <td style={td} colSpan={4}>
                <div style={noResultsStyle}>No patients match your search.</div>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <h2 style={{ marginTop: '32px' }}>Regional Coverage Map</h2>
      <PatientMap patients={patients} />
    </div>
  );
}

// Styles
const th = { padding: '12px', textAlign: 'left', fontSize: '13px', color: '#666' };
const td = { padding: '12px' };
const backBtn = { background: 'none', border: 'none', color: '#00796b', cursor: 'pointer', fontWeight: '600' };
const badge = { padding: '3px 10px', borderRadius: '10px', fontSize: '11px', fontWeight: '700' };
const visitedStatus = { display: 'inline-flex', alignItems: 'center', padding: '8px 14px', borderRadius: '999px', background: '#E8F8F5', color: '#0F5A44', fontWeight: '700', letterSpacing: '0.3px', fontSize: '13px', border: '1px solid rgba(15, 90, 68, 0.12)' };
const pendingStatus = { display: 'inline-flex', alignItems: 'center', padding: '8px 14px', borderRadius: '999px', background: '#FFF7E6', color: '#7A5A0C', fontWeight: '700', letterSpacing: '0.3px', fontSize: '13px', border: '1px solid rgba(122, 90, 12, 0.16)' };
const searchRow = { display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginTop: '24px' };
const searchInput = { width: '100%', maxWidth: '420px', padding: '12px 16px', borderRadius: '14px', border: '1px solid #c3d8d2', background: '#f4fbf9', fontSize: '15px', color: '#1a1a1a', outline: 'none', boxShadow: 'inset 0 1px 4px rgba(0,0,0,0.04)' };
const searchHint = { color: '#4a4a4a', fontSize: '13px' };
const noResultsStyle = { padding: '24px 0', textAlign: 'center', fontSize: '14px', color: '#666' };