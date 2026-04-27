// src/components/StatCards.jsx

export default function StatCards({ patients }) {
  const total = patients.length;
  const visited = patients.filter(p => p.visited).length;
  const pending = total - visited;

  const riskScore = (p) => {
    let score = 0;
    if (p.lastVisitDays > 14) score += 40;
    else if (p.lastVisitDays > 7) score += 20;
    else score += 5;
    if (['malnutrition', 'tb', 'postpartum'].includes(p.condition)) score += 50;
    else score += 10;
    return score;
  };

  const highRiskPending = patients.filter(
    p => !p.visited && riskScore(p) >= 70
  ).length;

  const pct = total > 0 ? Math.round((visited / total) * 100) : 0;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>

      <div style={card('#E1F5EE', '#5DCAA5')}>
        <div style={label}>Visited today</div>
        <div style={big('#0F6E56')}>{visited} / {total}</div>
        <div style={sub}>{pct}% complete</div>
      </div>

      <div style={card('#FCEBEB', '#F09595')}>
        <div style={label}>High risk pending</div>
        <div style={big('#A32D2D')}>{highRiskPending}</div>
        <div style={sub}>Needs urgent visit</div>
      </div>

      <div style={card('#FAEEDA', '#EF9F27')}>
        <div style={label}>Still pending</div>
        <div style={big('#854F0B')}>{pending}</div>
        <div style={sub}>Total remaining</div>
      </div>

    </div>
  );
}

const card = (bg, border) => ({
  background: bg,
  border: `1px solid ${border}`,
  borderRadius: '12px',
  padding: '16px',
});

const label = { fontSize: '12px', color: '#666', marginBottom: '6px' };
const big = (c) => ({ fontSize: '28px', fontWeight: '700', color: c });
const sub = { fontSize: '11px', color: '#999', marginTop: '4px' };