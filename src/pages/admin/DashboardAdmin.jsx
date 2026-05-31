import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoMK from '../../assets/logo-mk.png';

// ==========================================
// 1. KOMPONEN MODAL STATUS (BUKA / TUTUP)
// ==========================================
function StatusModal({ isOpen, onClose, lowonganNama, lowonganId, lowonganStatus, onConfirm }) {
  if (!isOpen) return null;

  const isClosing = lowonganStatus === 'Buka';

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div 
        className="fixed inset-0 bg-[#070314]/70 backdrop-blur-sm transition-opacity duration-300" 
        onClick={onClose}
      ></div>

      <div className="relative bg-[#150d33] border border-purple-950 rounded-2xl p-8 w-full max-w-sm shadow-[0_0_40px_rgba(0,0,0,0.7)] text-center backdrop-blur-md">
        <div className="flex justify-center mb-5">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center border-2 ${
            isClosing ? 'bg-red-950/30 border-red-600/50 text-red-500' : 'bg-green-950/30 border-green-600/50 text-green-500'
          }`}>
            <i className={`text-2xl fas ${isClosing ? 'fa-xmark' : 'fa-check'}`}></i>
          </div>
        </div>

        <h3 className="text-white font-semibold text-base mb-2 tracking-wide">
          {isClosing ? 'Tutup lowongan ini?' : 'Buka lowongan ini?'}
        </h3>
        <p className="text-gray-400 text-xs px-4 mb-6 leading-relaxed">
          {isClosing 
            ? 'Lowongan tidak akan tampil di halaman cari lowongan' 
            : 'Lowongan akan tampil kembali di halaman cari lowongan'}
        </p>

        <div className="grid grid-cols-2 gap-3">
          <button 
            type="button"
            onClick={onClose} 
            className="w-full bg-[#2a2249] hover:bg-[#342b58] text-gray-300 font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer"
          >
            Batal
          </button>
          <button 
            type="button"
            onClick={() => onConfirm(lowonganId, isClosing ? 'Tutup' : 'Buka')}
            className={`w-full text-white font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer ${
              isClosing ? 'bg-[#6b0f24] hover:bg-[#851631]' : 'bg-[#14532d] hover:bg-[#166534]'
            }`}
          >
            {isClosing ? 'Tutup' : 'Buka'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 2. KOMPONEN MODAL HAPUS LOWONGAN
// ==========================================
function DeleteModal({ isOpen, onClose, lowonganNama, lowonganId, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div 
        className="fixed inset-0 bg-[#070314]/70 backdrop-blur-sm transition-opacity duration-300" 
        onClick={onClose}
      ></div>

      <div className="relative bg-[#150d33] border border-purple-950 rounded-2xl p-8 w-full max-w-sm shadow-[0_0_40px_rgba(0,0,0,0.7)] text-center backdrop-blur-md">
        <div className="flex justify-center mb-5">
          <div className="w-16 h-16 rounded-full flex items-center justify-center border-2 bg-red-950/30 border-red-600/50 text-red-500">
            <i className="text-xl far fa-trash-can"></i>
          </div>
        </div>

        <h3 className="text-white font-semibold text-base mb-2 tracking-wide">
          Hapus lowongan Ini?
        </h3>
        <p className="text-gray-400 text-xs px-4 mb-6 leading-relaxed">
          Lowongan akan dihapus permanen dan tidak bisa dikembalikan
        </p>

        <div className="grid grid-cols-2 gap-3">
          <button 
            type="button"
            onClick={onClose} 
            className="w-full bg-[#2a2249] hover:bg-[#342b58] text-gray-300 font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer"
          >
            Batal
          </button>
          <button 
            type="button"
            onClick={() => onConfirm(lowonganId)}
            className="w-full bg-[#6b0f24] hover:bg-[#851631] text-white font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 3. KOMPONEN MODAL LOGOUT ADMIN
// ==========================================
function LogoutModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div 
        className="fixed inset-0 bg-[#070314]/70 backdrop-blur-sm transition-opacity duration-300" 
        onClick={onClose}
      ></div>

      <div className="relative bg-[#150d33] border border-purple-950 rounded-2xl p-8 w-full max-w-sm shadow-[0_0_40px_rgba(0,0,0,0.7)] text-center backdrop-blur-md">
        <div className="flex justify-center mb-5">
          <div className="w-16 h-16 rounded-full flex items-center justify-center border-2 bg-red-950/30 border-red-600/50 text-red-500">
            <i className="text-xl fas fa-arrow-right-from-bracket"></i>
          </div>
        </div>

        <h3 className="text-white font-semibold text-base mb-2 tracking-wide">
          Keluar dari admin panel?
        </h3>
        <p className="text-gray-400 text-xs px-4 mb-6 leading-relaxed">
          Kamu akan keluar dan di arahkan ke halaman login admin
        </p>

        <div className="grid grid-cols-2 gap-3">
          <button 
            type="button"
            onClick={onClose} 
            className="w-full bg-[#2a2249] hover:bg-[#342b58] text-gray-300 font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer"
          >
            Batal
          </button>
          <button 
            type="button"
            onClick={onConfirm}
            className="w-full bg-[#6b0f24] hover:bg-[#851631] text-white font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer"
          >
            Keluar
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================================
// 4. KOMPONEN UTAMA DASHBOARD ADMIN
// ==========================================================
export default function DashboardAdmin({ dataLowongan = [], setDataLowongan }) {
  const navigate = useNavigate();

  const [modalState, setModalState] = useState({ isOpen: false, lowongan: null });
  const [deleteModalState, setDeleteModalState] = useState({ isOpen: false, lowongan: null });
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  
  // State baru untuk kontrol visibility menu dropdown logout
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const openStatusModal = (lowongan) => {
    setModalState({ isOpen: true, lowongan: lowongan });
  };
  const closeStatusModal = () => {
    setModalState({ isOpen: false, lowongan: null });
  };
  const handleConfirmStatus = (id, newStatus) => {
    if (typeof setDataLowongan === 'function') {
      setDataLowongan(prev => 
        prev.map(item => item.id === id ? { ...item, status: newStatus } : item)
      );
    }
    closeStatusModal();
  };

  const openDeleteModal = (lowongan) => {
    setDeleteModalState({ isOpen: true, lowongan: lowongan });
  };
  const closeDeleteModal = () => {
    setDeleteModalState({ isOpen: false, lowongan: null });
  };
  const handleConfirmDelete = (id) => {
    if (typeof setDataLowongan === 'function') {
      setDataLowongan(prev => prev.filter(item => item.id !== id));
    }
    closeDeleteModal();
  };

  const handleConfirmLogout = () => {
    setIsDropdownOpen(false);
    setIsLogoutOpen(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen w-screen flex flex-col bg-[#070314] text-gray-200 font-sans select-none overflow-x-hidden">
      
      {/* NAVBAR */}
      <nav className="relative w-full bg-[#1b0d4f] pl-0 pr-6 h-16 flex justify-between items-center shadow-lg border-b border-purple-950/30 shrink-0">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center h-14">
          <img 
            src={logoMK} 
            alt="Logo" 
            className="h-full w-auto object-contain drop-shadow-[0_0_10px_rgba(168,85,247,0.6)]" 
          />
        </div>
        <div></div>

        {/* AREA PROFIL DENGAN DROPDOWN (Sesuai Desain Target) */}
        <div className="relative flex items-center">
          {/* Tombol Profil Pemicu */}
          <button 
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 text-xs text-purple-300 hover:text-white transition-colors cursor-pointer focus:outline-none"
          >
            <div className="w-8 h-8 bg-purple-900/40 border border-purple-500/20 rounded-full flex items-center justify-center">
              <i className="far fa-user text-purple-400"></i>
            </div>
            <span>Yanto Admin</span>
            <i className={`fas fa-chevron-down text-[8px] transition-transform duration-200 ${isDropdownOpen ? 'rotate-180 opacity-100' : 'opacity-50'}`}></i>
          </button>

          {/* WINDOW DROPDOWN LOGOUT */}
          {isDropdownOpen && (
            <div className="absolute right-0 top-11 w-44 bg-[#11092c] border border-purple-950 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.8)] p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <button
                type="button"
                onClick={() => {
                  setIsDropdownOpen(false);
                  setIsLogoutOpen(true);
                }}
                className="w-full px-3 py-2.5 text-left text-xs text-red-500 bg-[#0d0722]/60 hover:bg-[#1a0f44] border border-red-500/10 hover:border-red-500/30 rounded-lg flex items-center gap-3 transition-all cursor-pointer font-medium"
              >
                <i className="fas fa-arrow-right-from-bracket text-red-500 text-sm"></i>
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* UTAMA */}
      <main className="flex-grow py-8 px-10 w-full flex flex-col gap-8">
        
        {/* Baris Ucapan Selamat Datang */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-xl font-bold text-white tracking-wide">Selamat datang kembali, Admin!</h1>
            <p className="text-purple-400/50 text-xs mt-1">Berikut adalah ringkasan aktivitas dan statistik sistem terbaru</p>
          </div>
          
          {/* TOMBOL REKTIK LOGOUT LAMA SUDAH DIHAPUS DARI SINI AGAR BERSIH */}
        </div>

        {/* Kartu Statistik */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#0d0722]/60 border border-purple-950/40 p-5 rounded-2xl flex items-center gap-4 shadow-xl">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[#070314] text-sm font-bold shadow-md">
              <i className="fas fa-check"></i>
            </div>
            <div>
              <p className="text-gray-400 text-[11px]">Lowongan Aktif</p>
              <p className="text-2xl font-bold text-white mt-0.5">{dataLowongan.filter(l => l.status === 'Buka').length}</p>
            </div>
          </div>
          <div className="bg-[#0d0722]/60 border border-purple-950/40 p-5 rounded-2xl flex items-center gap-4 shadow-xl">
            <div className="w-12 h-12 bg-[#1b0d4f] border border-purple-500/20 rounded-xl flex items-center justify-center text-purple-400 text-sm">
              <i className="fas fa-users"></i>
            </div>
            <div>
              <p className="text-gray-400 text-[11px]">Total Mahasiswa</p>
              <p className="text-2xl font-bold text-white mt-0.5">5</p>
            </div>
          </div>
        </div>

        {/* Kelola Lowongan */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-bold text-white border-l-4 border-purple-600 pl-3 tracking-wide">Kelola lowongan</h2>
            <button 
              onClick={() => navigate('/tambah-lowongan')} 
              className="bg-white hover:bg-gray-200 text-black px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              <i className="fas fa-plus text-[10px]"></i> Tambah lowongan
            </button>
          </div>

          {/* Tabel */}
          <div className="bg-[#0d0722]/40 border border-purple-950/30 rounded-2xl overflow-hidden shadow-2xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-purple-950/10 text-gray-400 text-[10px] uppercase tracking-wider border-b border-purple-950/30">
                  <th className="px-6 py-3.5 font-semibold">Nama lowongan</th>
                  <th className="px-6 py-3.5 font-semibold">Tipe</th>
                  <th className="px-6 py-3.5 font-semibold text-center">Status</th>
                  <th className="px-6 py-3.5 font-semibold text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-xs divide-y divide-purple-950/20">
                {dataLowongan.map((item) => (
                  <tr key={item.id} className="hover:bg-purple-900/5 transition-colors">
                    <td className="px-6 py-4.5">
                      <p className="font-bold text-white text-sm tracking-wide">{item.nama}</p>
                      <p className="text-purple-400/30 text-[10px] mt-0.5">{item.perusahaan}</p>
                    </td>
                    <td className="px-6 py-4.5">
                      <span className="bg-purple-950/40 text-purple-300 px-2.5 py-0.5 rounded-md text-[9px] font-bold border border-purple-500/10 uppercase tracking-wide">
                        {item.tipe}
                      </span>
                    </td>
                    <td className="px-6 py-4.5 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-wide ${
                        item.status === 'Buka' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4.5">
                      <div className="flex justify-center items-center gap-3.5 text-sm">
                        <button 
                          type="button"
                          onClick={() => navigate('/edit-lowongan', { state: { lowongan: item } })}
                          className="text-gray-500 hover:text-white transition-colors cursor-pointer"
                        >
                          <i className="far fa-pen-to-square"></i>
                        </button>
                        
                        <button 
                          type="button"
                          onClick={() => openStatusModal(item)}
                          className="transition-colors cursor-pointer flex items-center justify-center"
                        >
                          {item.status === 'Buka' ? (
                            <i className="fas fa-circle-xmark text-red-600 hover:text-red-500 text-base"></i>
                          ) : (
                            <i className="fas fa-circle-check text-green-600 hover:text-green-500 text-base"></i>
                          )}
                        </button>
                        
                        <button 
                          type="button"
                          onClick={() => openDeleteModal(item)}
                          className="text-gray-700 hover:text-red-500 transition-colors cursor-pointer"
                        >
                          <i className="far fa-trash-can"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="w-full text-center py-4 text-[10px] text-purple-400/20 bg-[#0b051f] border-t border-purple-950/30 shrink-0">
        &copy;2026 Portal Magang & PKL
      </footer>

      {/* Pemanggilan Modals */}
      <StatusModal 
        isOpen={modalState.isOpen} 
        onClose={closeStatusModal}
        lowonganNama={modalState.lowongan?.nama}
        lowonganId={modalState.lowongan?.id}
        lowonganStatus={modalState.lowongan?.status}
        onConfirm={handleConfirmStatus}
      />

      <DeleteModal 
        isOpen={deleteModalState.isOpen}
        onClose={closeDeleteModal}
        lowonganNama={deleteModalState.lowongan?.nama}
        lowonganId={deleteModalState.lowongan?.id}
        onConfirm={handleConfirmDelete}
      />

      <LogoutModal 
        isOpen={isLogoutOpen} 
        onClose={() => setIsLogoutOpen(false)} 
        onConfirm={handleConfirmLogout} 
      />
    </div>
  );
}