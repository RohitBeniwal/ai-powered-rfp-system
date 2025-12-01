import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CreateRFP from './components/CreateRFP';
import VendorList from './components/VendorList';
import RFPList from './components/RFPList';
import SimulateResponse from './components/SimulateResponse';
import ComparisonView from './components/ComparisonView';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <h1>🎯 AI-Powered RFP Management System</h1>
          <ul className="nav-links">
            <li><Link to="/">RFPs</Link></li>
            <li><Link to="/create-rfp">Create RFP</Link></li>
            <li><Link to="/vendors">Vendors</Link></li>
            <li><Link to="/simulate-response">Simulate Response</Link></li>
          </ul>
        </nav>

        <div className="container">
          <Routes>
            <Route path="/" element={<RFPList />} />
            <Route path="/create-rfp" element={<CreateRFP />} />
            <Route path="/vendors" element={<VendorList />} />
            <Route path="/simulate-response" element={<SimulateResponse />} />
            <Route path="/comparison/:rfpId" element={<ComparisonView />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
