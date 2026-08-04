import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Tutorial from './Tutorial'; 

function App() {
  return (
    <Router>
      <div style={{ fontFamily: 'Arial, sans-serif' }}>
        
        {/* BAAFATA (NAVIGATION MENU) */}
        <nav style={{ padding: '20px', backgroundColor: '#1a5276', display: 'flex', gap: '30px', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '18px', fontWeight: 'bold' }}>🏠 Gara Duraa</Link>
          <Link to="/sagantaa" style={{ color: 'white', textDecoration: 'none', fontSize: '18px', fontWeight: 'bold' }}>📅 Sagantaa Baasi</Link>
          
          {/* LINK TUTORIAL MENU JALA GALCHAME */}
          <Link to="/tutorial" style={{ color: '#f1c40f', textDecoration: 'none', fontSize: '18px', fontWeight: 'bold', marginLeft: 'auto' }}>
            📖 Qajeelfama (Tutorial)
          </Link>
        </nav>

        {/* BKKKA QABIYYEEN ITTI MUL'ATU (ROUTES) */}
        <div style={{ padding: '20px' }}>
          <Routes>
            <Route path="/" element={<h2 style={{textAlign: 'center'}}>Baga Nagaan Dhuftan!</h2>} />
            <Route path="/sagantaa" element={<h2 style={{textAlign: 'center'}}>Bakka sagantaan itti baafamu asidha.</h2>} />
            
            {/* TUTORIAL ROUTE */}
            <Route path="/tutorial" element={<Tutorial />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
