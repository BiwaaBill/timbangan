import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import Homepage from './pages/Homepage';
import Penimbangan from './pages/Penimbangan';
import MasterProduct from './pages/MasterProduct';
import CustomerPage from './pages/CustomerPage';
import Transporter from './pages/Transporter';
import Kendaraan from './pages/Kendaraan';
import Laporan from './pages/Laporan';
import Login from './pages/Login';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<MainLayout />}>
          <Route path="/homepage" element={<Homepage />} />
          <Route path="/penimbangan" element={<Penimbangan />} />
          <Route path="/master-product" element={<MasterProduct />} />
          <Route path="/customer" element={<CustomerPage />} />
          <Route path="/transporter" element={<Transporter />} />
          <Route path="/kendaraan" element={<Kendaraan />} />
          <Route path="/laporan" element={<Laporan />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
