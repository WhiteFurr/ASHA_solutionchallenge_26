import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function PatientDetail() {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pDoc = await getDoc(doc(db, 'patients', patientId));
        if (pDoc.exists()) setPatient(pDoc.data());
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [patientId]);

  if (loading) return <div style={statusStyle}>Refining medical records...</div>;
  if (!patient) return <div style={statusStyle}>Patient profile not found.</div>;

  return (
    <div style={containerLayout}>
      {/* ACTION BAR */}
      <nav style={navBar}>
        <button onClick={() => navigate(-1)} style={backButtonStyle}>
          <span style={{ fontSize: '18px' }}>←</span> Return to Regional Overview
        </button>
      </nav>
      
      <div style={glassCard}>
        {/* HEADER SECTION */}
        <header style={headerWrapper}>
          <div style={profileCircle}>{patient.name ? patient.name[0] : 'P'}</div>
          <div style={headerText}>
            <h1 style={patientName}>{patient.name}</h1>
            <div style={badgeContainer}>
              <span style={conditionBadge}>{patient.condition || 'General'}</span>
              <span style={idBadge}>UID: {patient.chwId || 'N/A'}</span>
            </div>
          </div>
        </header>

        <div style={gridGrid}>
          {/* LEFT COLUMN: AI INSIGHTS */}
          <div style={{ flex: 2 }}>
            <section style={premiumSection}>
              <h3 style={sectionLabel}>📋 CLINICAL VISIT SUMMARY</h3>
              <div style={aiReportBox}>
                {typeof patient.aiReport === 'object' && patient.aiReport !== null ? (
                  Object.entries(patient.aiReport).map(([key, value]) => (
                    <div key={key} style={reportRow}>
                      <span style={keyText}>{key.replace(/([A-Z])/g, ' $1')}:</span>
                      <span style={valText}>{String(value)}</span>
                    </div>
                  ))
                ) : (
                  <p style={placeholderText}>{patient.aiReport || "No summary generated for this session."}</p>
                )}
              </div>
            </section>

            <section style={premiumSection}>
              <h3 style={sectionLabel}>🎙️ VOICE TRANSCRIPTION</h3>
              <div style={voiceBox}>
                <span style={quoteIcon}>“</span>
                <p style={voiceText}>{patient.voiceNote || "No audio logs available."}</p>
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN: ACTIONABLE CHECKLIST */}
          <div style={{ flex: 1.2 }}>
            <section style={premiumSection}>
              <h3 style={sectionLabel}>✅ SAFETY COMPLIANCE</h3>
              <div style={checklistCard}>
                {Array.isArray(patient.aiChecklist) ? (
                  <div style={checkListWrapper}>
                    {patient.aiChecklist.map((item, index) => (
                      <div key={index} style={checkItem}>
                        <div style={checkCircle}>L</div>
                        <span style={checkText}>{item}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={placeholderText}>{patient.aiChecklist || "Checklist pending."}</p>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- PREMIUM STYLING SYSTEM ---

const containerLayout = { maxWidth: '1200px', margin: '0 auto', animation: 'fadeIn 0.5s ease-in' };

const navBar = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' };

const backButtonStyle = { 
  background: 'none', border: 'none', color: '#00796b', cursor: 'pointer', 
  fontWeight: '600', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px',
  transition: '0.2s', opacity: 0.8
};

const glassCard = { 
  background: '#ffffff', borderRadius: '24px', padding: '50px', 
  boxShadow: '0 20px 60px rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.03)' 
};

const headerWrapper = { display: 'flex', alignItems: 'center', gap: '25px', marginBottom: '45px' };

const headerText = { display: 'flex', flexDirection: 'column', gap: '12px', minWidth: 0 };

const profileCircle = { 
  width: '80px', height: '80px', borderRadius: '24px', background: 'linear-gradient(135deg, #00796b, #004d40)',
  color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: 'bold'
};

const patientName = { fontSize: '38px', fontWeight: '800', margin: '0 0 8px 0', color: '#1a1a1a', letterSpacing: '-0.5px' };

const badgeContainer = { display: 'flex', gap: '10px' };

const conditionBadge = { 
  padding: '6px 14px', borderRadius: '8px', background: '#e0f2f1', color: '#00796b', 
  fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' 
};

const idBadge = { padding: '6px 14px', borderRadius: '8px', background: '#f5f5f5', color: '#777', fontSize: '12px', fontWeight: '600' };

const gridGrid = { display: 'flex', gap: '40px', flexWrap: 'wrap' };

const premiumSection = { marginBottom: '40px' };

const sectionLabel = { fontSize: '12px', fontWeight: '800', color: '#999', letterSpacing: '1.5px', marginBottom: '15px' };

const aiReportBox = { background: '#fcfdfe', borderRadius: '16px', padding: '25px', border: '1px solid #f0f0f0' };

const reportRow = { display: 'flex', padding: '12px 0', borderBottom: '1px solid #f5f5f5' };

const keyText = { flex: '0 0 160px', fontWeight: '700', color: '#555', fontSize: '14px' };

const valText = { color: '#333', fontSize: '15px', lineHeight: '1.5' };

const voiceBox = { background: '#fff', border: '1px dashed #d1d1d1', borderRadius: '16px', padding: '25px', position: 'relative' };

const quoteIcon = { position: 'absolute', top: '10px', left: '10px', fontSize: '40px', color: '#e0e0e0', fontFamily: 'serif' };

const voiceText = { margin: 0, color: '#555', fontStyle: 'italic', fontSize: '16px', lineHeight: '1.7', paddingLeft: '20px' };

const checklistCard = { background: '#00796b', borderRadius: '20px', padding: '30px', color: 'white', boxShadow: '0 10px 30px rgba(0,121,107,0.2)' };

const checkListWrapper = { display: 'flex', flexDirection: 'column', gap: '14px' };

const checkItem = { display: 'flex', gap: '15px', marginBottom: '18px', alignItems: 'flex-start' };

const checkCircle = { 
  minWidth: '22px', height: '22px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', 
  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold' 
};

const checkText = { fontSize: '15px', fontWeight: '500', lineHeight: '1.4' };

const statusStyle = { textAlign: 'center', padding: '100px', fontSize: '18px', color: '#999', fontWeight: '500' };

const placeholderText = { color: '#bbb', fontStyle: 'italic' };