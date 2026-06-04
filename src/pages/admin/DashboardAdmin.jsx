import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle, 
  Users, 
  Edit, 
  XCircle, 
  Check, 
  Trash2, 
  KeyRound, 
  Search, 
  Plus,
  ChevronDown,
  LogOut
} from 'lucide-react';
import logoMK from '../../assets/logo-mk.png';

// ==========================================
// 1. KOMPONEN MODAL LOGOUT ADMIN
// ==========================================
function LogoutModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-[#070314]/70 backdrop-blur-sm transition-opacity duration-300" onClick={onClose}></div>
      <div className="relative bg-[#150d33] border border-purple-950 rounded-2xl p-8 w-full max-w-sm shadow-[0_0_40px_rgba(0,0,0,0.7)] text-center backdrop-blur-md">
        <div className="flex justify-center mb-5">
          <div className="w-16 h-16 rounded-full flex items-center justify-center border-2 bg-red-950/30 border-red-600/50 text-red-500">
            <LogOut size={24} className="rotate-180" />
          </div>
        </div>

        <h3 className="text-white font-semibold text-base mb-2 tracking-wide">Keluar dari admin panel?</h3>
        <p className="text-gray-400 text-xs px-4 mb-6 leading-relaxed">Kamu akan keluar dan di arahkan ke halaman utama</p>

        <div className="grid grid-cols-2 gap-3">
          <button type="button" onClick={onClose} className="w-full bg-[#2a2249] hover:bg-[#342b58] text-gray-300 font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer">
            Batal
          </button>
          <button type="button" onClick={onConfirm} className="w-full bg-[#6b0f24] hover:bg-[#851631] text-white font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer">
            Keluar
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================================
// 2. KOMPONEN UTAMA DASHBOARD ADMIN
// ==========================================================
export default function DashboardAdmin({ dataLowongan = [], setDataLowongan }) {
  const navigate = useNavigate();

  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [searchPengguna, setSearchPengguna] = useState('');
  const [dataPengguna] = useState([
    { id: 1, nama: 'Karim Benzema', email: 'KarimBenzema@gmail.com', foto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80' },
    { id: 2, nama: 'Luca Modric', email: 'LucaModric@gmail.com', foto: null },
    { id: 3, nama: 'Leny Yoro', email: 'LenyYoro@gmail.com', foto: null }
  ]);

  // Statistik lowongan aktif secara real-time
  const activeJobsCount = dataLowongan.filter(item => item.status === 'Buka').length;

  const filteredPengguna = dataPengguna.filter(user => 
    user.nama.toLowerCase().includes(searchPengguna.toLowerCase()) ||
    user.email.toLowerCase().includes(searchPengguna.toLowerCase())
  );

  // LANGSUNG UBAH STATUS (Tanpa Modal Konfirmasi)
  const handleToggleStatus = (id, currentStatus) => {
    const newStatus = currentStatus === 'Buka' ? 'Tutup' : 'Buka';
    if (typeof setDataLowongan === 'function') {
      setDataLowongan(prev => 
        prev.map(item => item.id === id ? { ...item, status: newStatus } : item)
      );
    }
  };

  // LANGSUNG HAPUS (Tanpa Modal Konfirmasi)
  const handleDirectDelete = (id) => {
    if (typeof setDataLowongan === 'function') {
      setDataLowongan(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleConfirmLogout = () => {
    setIsDropdownOpen(false);
    setIsLogoutOpen(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen w-screen flex flex-col bg-[#0b031e] text-gray-200 font-sans select-none overflow-x-hidden">
      
      {/* NAVBAR */}
      <nav className="relative w-full bg-[#1e115e] pl-4 pr-6 h-16 flex justify-between items-center shadow-lg border-b border-purple-950/20 shrink-0">
        <div className="flex items-center h-14">
          <img src={logoMK} alt="Logo" className="h-full w-auto object-contain drop-shadow-[0_0_10px_rgba(168,85,247,0.6)]" /> 
        </div>

        {/* AREA PROFIL */}
        <div className="relative flex items-center">
          <button 
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors cursor-pointer focus:outline-none"
          >
            <div className="w-7 h-7 rounded-full flex items-center justify-center border border-gray-400/50 bg-[#10092b]">
              <span className="text-gray-200 text-xs font-bold">A</span>
            </div>
            <span className="text-gray-300 text-sm">Admin</span>
            <ChevronDown size={12} className={`text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 top-12 w-48 bg-[#180e3d] border border-purple-950/60 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.8)] p-1.5 z-50">
              <button
                type="button"
                onClick={() => {
                  setIsDropdownOpen(false);
                  setIsLogoutOpen(true);
                }}
                className="w-full px-3 py-2 text-left text-xs text-red-500 hover:bg-[#25175c] rounded-lg flex items-center gap-3 transition-all cursor-pointer font-medium"
              >
                <LogOut size={14} className="text-red-500" />
                <span>Keluar</span>
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* UTAMA */}
      <main className="flex-grow py-8 px-10 w-full flex flex-col gap-8 max-w-7xl mx-auto">
        
        {/* Baris Ucapan Selamat Datang */}
        <div>
          <h1 className="text-xl font-bold text-white tracking-wide">Selamat datang kembali, Admin!</h1>
          <p className="text-gray-400 text-xs mt-1">Berikut adalah ringkasan aktivitas dan statistik sistem terbaru</p>
        </div>

        {/* Kartu Statistik */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#180f3d] border border-purple-950/20 p-6 rounded-xl flex items-center gap-5 shadow-xl">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#180f3d] shadow-md">
              <CheckCircle size={24} />
            </div>
            <div>
              <p className="text-gray-300 text-sm font-medium">Lowongan Aktif</p>
              <p className="text-2xl font-bold text-white mt-0.5">{activeJobsCount}</p>
            </div>
          </div>
          <div className="bg-[#180f3d] border border-purple-950/20 p-6 rounded-xl flex items-center gap-5 shadow-xl">
            <div className="w-12 h-12 flex items-center justify-center text-gray-300">
              <Users size={28} />
            </div>
            <div>
              <p className="text-gray-300 text-sm font-medium">Total Mahasiswa/Siswa</p>
              <p className="text-2xl font-bold text-white mt-0.5">{filteredPengguna.length}</p>
            </div>
          </div>
        </div>

        {/* ==================== KELOLA LOWONGAN ==================== */}
        <div className="flex flex-col gap-4 bg-[#180f3d]/50 border border-purple-950/40 p-6 rounded-xl shadow-xl">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-semibold text-gray-200 tracking-wide">Kelola lowongan</h2>
            <button 
              onClick={() => navigate('/tambah-lowongan')} 
              className="bg-transparent hover:bg-purple-900/20 text-white border border-purple-500/40 px-4 py-2 rounded-xl font-medium text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              <Plus size={14} /> Tambah lowongan
            </button>
          </div>

          <div className="overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-gray-400 text-xs tracking-wider border-b border-purple-950/40">
                  <th className="px-4 py-3 font-normal text-gray-400/70 w-1/2">Nama lowongan</th>
                  <th className="px-4 py-3 font-normal text-gray-400/70">Tipe</th>
                  <th className="px-4 py-3 font-normal text-gray-400/70 text-center">Status</th>
                  <th className="px-4 py-3 font-normal text-gray-400/70 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-xs divide-y divide-purple-950/30">
                {dataLowongan.length > 0 ? (
                  dataLowongan.map((item) => (
                    <tr key={item.id} className="hover:bg-purple-900/10 transition-colors">
                      <td className="px-4 py-4">
                        <h3 className="font-bold text-white text-base tracking-wide">{item.nama}</h3>
                        <p className="text-gray-500 text-[11px] mt-0.5">{item.perusahaan}</p>
                      </td>
                      <td className="px-4 py-4">
                        <span className="bg-[#2a175c] text-purple-300 px-3 py-1 rounded-full text-[10px] font-medium tracking-wide">
                          {item.tipe}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-medium tracking-wide ${
                          item.status === 'Buka' ? 'bg-green-900/40 text-green-400' : 'bg-red-900/40 text-red-400'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex justify-center items-center gap-3">
                          <button 
                            type="button"
                            onClick={() => navigate('/edit-lowongan', { state: { lowongan: item } })}
                            className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all cursor-pointer"
                            title="Edit lowongan"
                          >
                            <Edit size={15} />
                          </button>
                          
                          {/* Tombol Status langsung ganti data */}
                          <button 
                            type="button"
                            onClick={() => handleToggleStatus(item.id, item.status)}
                            className="p-1.5 rounded-lg transition-all cursor-pointer flex items-center justify-center"
                            title={item.status === 'Buka' ? 'Tutup lowongan' : 'Buka lowongan'}
                          >
                            {item.status === 'Buka' ? (
                              <XCircle size={15} className="text-red-500 hover:text-red-400" />
                            ) : (
                              <Check size={15} className="text-green-500 hover:text-green-400" />
                            )}
                          </button>
                          
                          {/* Tombol Hapus langsung buang data */}
                          <button 
                            type="button"
                            onClick={() => handleDirectDelete(item.id)}
                            className="p-1.5 text-red-500 hover:text-red-400 hover:bg-red-500/5 rounded-lg transition-all cursor-pointer"
                            title="Hapus lowongan"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-4 py-8 text-center text-gray-500 text-xs font-medium">
                      Belum ada data lowongan
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ==================== KELOLA PENGGUNA ==================== */}
        <div className="flex flex-col gap-4 bg-[#180f3d]/50 border border-purple-950/40 p-6 rounded-xl shadow-xl">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-semibold text-gray-200 tracking-wide">Kelola pengguna</h2>
            
            <div className="relative w-64">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Search size={13} />
              </span>
              <input 
                type="text" 
                placeholder="Cari pengguna...."
                value={searchPengguna}
                onChange={(e) => setSearchPengguna(e.target.value)}
                className="w-full bg-[#10092b] border border-purple-950 text-white pl-9 pr-4 py-2 rounded-xl font-medium text-xs shadow-md transition-all focus:outline-none placeholder-gray-400"
              />
            </div>
          </div>

          <div className="overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-gray-400 text-xs tracking-wider border-b border-purple-950/40">
                  <th className="px-4 py-3 font-normal text-gray-400/70 w-1/2">Nama</th>
                  <th className="px-4 py-3 font-normal text-gray-400/70">Email</th>
                  <th className="px-4 py-3 font-normal text-gray-400/70 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-xs divide-y divide-purple-950/30">
                {filteredPengguna.length > 0 ? (
                  filteredPengguna.map((user) => (
                    <tr key={user.id} className="hover:bg-purple-900/10 transition-colors">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          {user.foto ? (
                            <img src={user.foto} alt={user.nama} className="w-9 h-9 rounded-full object-cover border border-purple-950/50" />
                          ) : (
                            <div className="w-9 h-9 bg-purple-900/30 text-purple-300 rounded-full flex items-center justify-center font-bold text-sm border border-purple-950/40">
                              {user.nama.charAt(0)}
                            </div>
                          )}
                          <span className="font-bold text-white text-base tracking-wide">{user.nama}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-gray-400 text-xs">
                        {user.email}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <button 
                          type="button" 
                          onClick={() => alert(`Link reset password untuk ${user.nama} berhasil diproses.`)}
                          className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                          title="Reset password"
                        >
                          <KeyRound size={15} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="px-4 py-8 text-center text-gray-500 text-xs font-medium">
                      Pengguna tidak ditemukan
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="w-full text-center py-4 text-[10px] text-purple-400/20 bg-[#0b051f] border-t border-purple-950/30 shrink-0">
        &copy;2026 Portal Magang & PKL
      </footer>

      {/* Hanya modal logout yang dipertahankan menggunakan popup */}
      <LogoutModal 
        isOpen={isLogoutOpen} 
        onClose={() => setIsLogoutOpen(false)} 
        onConfirm={handleConfirmLogout} 
      />
    </div>
  );
}