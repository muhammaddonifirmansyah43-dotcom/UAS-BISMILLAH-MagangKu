import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoMK from '../../assets/logo-mk.png';

export default function LoginAdmin() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isError, setIsError] = useState(false); 
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State untuk mengontrol dropdown profil
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.username === 'admin' && formData.password === 'admin123') {
      setIsError(false);
      try {
        navigate('/dashboard-admin');
      } catch (error) {
        console.error("Gagal navigasi ke /dashboard-admin, mencoba rute utama:", error);
        navigate('/');
      }
    } else {
      setIsError(true); 
    }
  };

  return (
    <div className="min-h-screen w-screen flex flex-col bg-[#070314] text-gray-200 font-sans select-none overflow-x-hidden relative">
      
      {/* 1. NAVBAR */}
      <nav className="relative w-full bg-[#1b0d4f] pl-0 pr-6 h-16 flex justify-between items-center shadow-lg border-b border-purple-950/30 shrink-0 z-50">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center h-14">
          <img 
            src={logoMK} 
            alt="Logo" 
            className="h-full w-auto object-contain drop-shadow-[0_0_10px_rgba(168,85,247,0.6)]" 
          />
        </div>
        <div></div>
        
        {/* AREA TOMBOL PROFIL & DROPDOWN DROPDOWN */}
        <div className="relative flex items-center">
          <button 
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 text-xs text-purple-300 hover:text-white transition-colors cursor-pointer focus:outline-none"
          >
            <div className="w-8 h-8 bg-purple-900/40 border border-purple-500/20 rounded-full flex items-center justify-center">
              <i className="far fa-user text-purple-400"></i>
            </div>
            <span>Admin</span>
            <i className={`fas fa-chevron-down text-[8px] transition-transform duration-200 ${isDropdownOpen ? 'rotate-180 opacity-100' : 'opacity-50'}`}></i>
          </button>

          {/* WINDOW DROPDOWN LOGOUT (Gaya Selaras dengan Kotak Login) */}
          {isDropdownOpen && (
            <div className="absolute right-0 top-11 w-44 bg-[#0d0722]/95 border border-purple-950/50 rounded-2xl p-2.5 z-50 backdrop-blur-sm shadow-[0_0_25px_rgba(147,51,234,0.25)]">
              <button
                type="button"
                onClick={() => {
                  setIsDropdownOpen(false);
                  alert("Melakukan sistem logout...");
                }}
                className="w-full px-4 py-3 text-left text-xs text-red-500 bg-[#1b113e]/30 hover:bg-[#1b113e]/70 border border-purple-500/10 hover:border-red-500/20 rounded-xl flex items-center gap-3 transition-all cursor-pointer font-medium group"
              >
                <i className="fas fa-arrow-right-from-bracket text-red-500 text-sm transition-transform group-hover:translate-x-0.5"></i>
                <span className="tracking-wide">Logout</span>
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* 2. KOTAK UTAMA LOGIN */}
      {/* Menggunakan py-12 agar memberikan ruang/jarak vertikal yang ideal antara navbar, kotak login, dan footer */}
      <main className="flex-grow flex items-center justify-center px-4 py-12 relative overflow-hidden">
        
        {/* BULATAN BLUR BACKGROUND */}
        <div className="absolute left-[-10%] top-[40%] w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute right-[-10%] top-[30%] w-[500px] h-[500px] bg-pink-600/10 rounded-full blur-[150px] pointer-events-none"></div>

        {/* KOTAK LOGIN - max-w-md agar ukurannya presisi dan seimbang sesuai mockup */}
        <div className="w-full max-w-md bg-[#0d0722]/60 border border-purple-950/40 rounded-[32px] p-10 relative text-center shadow-[0_0_50px_rgba(147,51,234,0.2)] backdrop-blur-md z-10">
          
          {/* Ikon Perisai Kunci Bawaan */}
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 bg-[#1b113e]/40 border border-purple-500/10 rounded-full flex items-center justify-center text-purple-400/60">
              <i className="fas fa-shield-halved text-base"></i>
            </div>
          </div>

          {/* Judul & Deskripsi */}
          <h2 className="text-gray-200 font-medium text-xl tracking-wide">Login Admin</h2>
          <p className="text-gray-500 text-xs mt-2 mb-8 px-4 leading-relaxed">
            Masuk ke panel admin untuk mengelola lowongan
          </p>

          {/* ALERT BOX MERAH */}
          {isError && (
            <div className="mb-6 bg-red-950/30 border border-red-600/40 rounded-xl p-3 flex items-center gap-2.5 text-red-500 text-xs text-left">
              <i className="fas fa-circle-info text-sm"></i>
              <span>Username atau Password salah</span>
            </div>
          )}

          {/* Form Input */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-6 text-left">
            
            {/* Input Email / Nama Pengguna */}
            <div className="flex flex-col gap-2">
              <label className="text-gray-400 font-normal text-sm tracking-wide">
                Email / Nama Pengguna
              </label>
              <input 
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
                className={`w-full bg-[#070314]/50 border rounded-2xl px-5 py-3.5 text-sm text-white font-light focus:outline-none transition-all ${
                  isError ? 'border-red-600/50 focus:border-red-500' : 'border-purple-950/60 focus:border-purple-500/50'
                }`}
              />
              {isError && (
                <span className="text-red-500 text-[11px] pl-1 font-medium">Username salah</span>
              )}
            </div>

            {/* Input Password */}
            <div className="flex flex-col gap-2 relative">
              <label className="text-gray-400 font-normal text-sm tracking-wide">
                Password
              </label>
              <div className="relative w-full">
                <input 
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className={`w-full bg-[#070314]/50 border rounded-2xl pl-5 pr-14 py-3.5 text-sm text-white font-light focus:outline-none transition-all ${
                    isError ? 'border-red-600/50 focus:border-red-500' : 'border-purple-950/60 focus:border-purple-500/50'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors cursor-pointer"
                >
                  <i className={`far ${showPassword ? 'fa-eye' : 'fa-eye-slash'} text-xs opacity-60`}></i>
                </button>
              </div>
              {isError && (
                <span className="text-red-500 text-[11px] pl-1 font-medium">Password salah</span>
              )}
            </div>

            {/* Tombol Masuk */}
            <div className="flex justify-center mt-4">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#9333ea] via-[#c026d3] to-[#ec4899] hover:opacity-95 text-white font-medium text-base py-3 rounded-full shadow-[0_4px_20px_rgba(192,38,211,0.3)] transition-all transform active:scale-[0.99] cursor-pointer text-center tracking-wide"
              >
                Masuk
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* 3. FOOTER */}
      <footer className="w-full text-center py-4 text-[10px] text-purple-400/20 bg-[#0b051f] border-t border-purple-950/30 shrink-0">
        &copy;2026 Portal Magang & PKL
      </footer>
    </div>
  );
}