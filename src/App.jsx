import React, { useState, useEffect } from 'react'; // Tambah useEffect di sini
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginAdmin from './pages/admin/LoginAdmin';
import DashboardAdmin from './pages/admin/DashboardAdmin';
import TambahLowongan from './pages/admin/TambahLowongan';
import EditLowongan from './pages/admin/EditLowongan';

function App() {
  // 1. Ambil data dari localStorage saat aplikasi pertama kali dimuat.
  //    Jika belum ada data sama sekali (habis login pertama kali), otomatis jadi kosong []
  const [dataLowongan, setDataLowongan] = useState(() => {
    const dataTersimpan = localStorage.getItem('data_lowongan_portal');
    return dataTersimpan ? JSON.parse(dataTersimpan) : [];
  });

  // 2. Simpan otomatis ke localStorage SETIAP KALI dataLowongan berubah 
  //    (baik saat ditambah, diedit, maupun dihapus)
  useEffect(() => {
    localStorage.setItem('data_lowongan_portal', JSON.stringify(dataLowongan));
  }, [dataLowongan]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginAdmin />} />
        
        {/* OPER DATA KE DASHBOARD */}
        <Route 
          path="/dashboard-admin" 
          element={<DashboardAdmin dataLowongan={dataLowongan} setDataLowongan={setDataLowongan} />} 
        />

        <Route 
          path="/dashboard-user" 
          element={<Dashboard dataLowongan={dataLowongan} setDataLowongan={setDataLowongan} />} 
        />
        
        {/* OPER STATE KE TAMBAH (DIBALIKKAN KE PATH /dashboard-admin) */}
        <Route 
          path="/tambah-lowongan" 
          element={<TambahLowongan dataLowongan={dataLowongan} setDataLowongan={setDataLowongan} />} 
        />
        
        {/* FIX WHITESCREEN: Jalur disamakan dengan navigate milik dashboard */}
        <Route 
          path="/edit-lowongan" 
          element={<EditLowongan dataLowongan={dataLowongan} setDataLowongan={setDataLowongan} />} 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;