import { useState } from 'react';
import HomePage from './pages/HomePage';
import AddAd from './pages/AddAd';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/add" element={<AddAd />} />
      </Routes>
    </Router>
  );
}
export default App;
