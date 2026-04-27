import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AshaList from './pages/AshaList';
import PatientList from './pages/PatientList';
import PatientDetail from './pages/PatientDetail';

function App() {
  return (
    <Router>
      <div style={{ 
        minHeight: '100vh',
        backgroundColor: '#7cc7c2', // Changed to a slightly darker grey so the white box "pops"
        padding: '30px',
        display: 'flex',
        justifyContent: 'center'
      }}>
        <div style={{ 
          width: '95%', // Takes up 95% of your screen width
          maxWidth: '1700px', // Allows it to go very wide on laptops
          background: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
          minHeight: '90vh',
          padding: '50px', // More breathing room inside the box
          boxSizing: 'border-box'
        }}>
          <Routes>
            <Route path="/" element={<AshaList />} />
            <Route path="/asha/:ashaId/:regionId" element={<PatientList />} />
            <Route path="/patient/:patientId" element={<PatientDetail />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;