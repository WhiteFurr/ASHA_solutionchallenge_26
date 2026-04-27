import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'; 
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';

export default function AshaList() {
  const [ashas, setAshas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Ordering by Region ID so it goes A1, A2, A3...
    const ashaQuery = query(collection(db, 'ashas'), orderBy('regionId', 'asc'));

    const unsub = onSnapshot(
      ashaQuery, 
      (snap) => {
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setAshas(data);
        setLoading(false);
      },
      (err) => {
        console.error("Firebase Error:", err);
        setError(err.message);
        setLoading(false);
      }
    );

    return unsub;
  }, []);

  if (loading) return <div style={statusMsg}>Organizing Dashboard...</div>;
  if (error) return <div style={{...statusMsg, color: 'red'}}>Error: {error}</div>;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <header style={{ marginBottom: '50px', borderBottom: '3px solid #00796b', paddingBottom: '30px' }}>
        <h1 style={{ color: '#111', margin: 0, fontSize: '2.8rem', fontWeight: '900' }}>
          ASHA Supervisor Dashboard
        </h1>
        <p style={{ color: '#444', marginTop: '12px', fontSize: '1.2rem', fontWeight: '500' }}>
          Review community health worker performance and regional data.
        </p>
      </header>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
        gap: '35px' 
      }}>
        {ashas.length > 0 ? (
          ashas.map(asha => {
            const displayName = asha.name || asha.Name || 'Unknown ASHA';
            
            return (
              <div 
                key={asha.id} 
                onClick={() => navigate(`/asha/${asha.id}/${asha.regionId}`)}
                style={cardStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-10px)';
                  e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.12)';
                  e.currentTarget.style.borderColor = '#00796b';
                  e.currentTarget.style.background = '#faffff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                  e.currentTarget.style.borderColor = '#b2dfdb'; // Darker "invisible" border
                  e.currentTarget.style.background = '#ffffff';
                }}
              >
                <div style={avatarStyle}>{displayName[0]}</div>
                <h3 style={{ margin: '0 0 10px 0', color: '#111', fontSize: '22px', fontWeight: '700' }}>
                  {displayName}
                </h3>
                <div style={regionBadge}>Region {asha.regionId || '??'}</div>
                
                <div style={{ 
                  marginTop: '25px', 
                  paddingTop: '15px', 
                  borderTop: '1px solid #eee', 
                  width: '100%',
                  color: '#00796b', 
                  fontWeight: '800',
                  fontSize: '14px'
                }}>
                  OPEN ROSTER →
                </div>
              </div>
            );
          })
        ) : (
          <div style={emptyStateStyle}>
            <h3>No ASHA Workers Found</h3>
            <p>Waiting for database sync...</p>
          </div>
        )}
      </div>
    </div>
  );
}

// --- Enhanced High-Visibility Styles ---
const statusMsg = { textAlign: 'center', padding: '100px', fontSize: '18px', color: '#333', fontWeight: '600' };

const cardStyle = {
  background: '#ffffff',
  padding: '40px 25px 25px 25px',
  borderRadius: '28px',
  // CHANGED: Border is now #b2dfdb (teal-grey) instead of light grey
  border: '2px solid #b2dfdb', 
  cursor: 'pointer',
  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  position: 'relative'
};

const avatarStyle = {
  width: '80px',
  height: '80px',
  borderRadius: '24px',
  background: 'linear-gradient(135deg, #00796b, #004d40)',
  color: '#ffffff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '32px',
  fontWeight: '800',
  marginBottom: '20px',
  boxShadow: '0 5px 15px rgba(59, 173, 160, 0.3)'
};

const regionBadge = {
  background: '#00796b',
  color: '#ffffff',
  padding: '6px 18px',
  borderRadius: '12px',
  fontSize: '14px',
  fontWeight: '700',
  letterSpacing: '1px'
};

const emptyStateStyle = {
  gridColumn: '1 / -1',
  textAlign: 'center',
  padding: '60px',
  border: '3px dashed #b2dfdb',
  borderRadius: '28px',
  color: '#666'
};