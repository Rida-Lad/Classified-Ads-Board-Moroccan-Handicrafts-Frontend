import React from 'react';
import HomePage from './pages/HomePage';
import AdForm from './pages/AddAdPage';
import ManageAd from './pages/ManageAd';
import AdminStats from './pages/AdminStats';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/add" element={<AdForm />} />
        <Route path="/manage" element={<ManageAd />} />
        <Route path="/admin" element={<AdminStats />} />
      </Routes>
    </Router>
  );
}
export default App;
