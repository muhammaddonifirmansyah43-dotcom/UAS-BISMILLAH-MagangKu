import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logoMK from '../../assets/logo-mk.png';

export default function EditLowongan({ dataLowongan, setDataLowongan }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [lowonganId, setLowonganId] = useState(null);
  const [formData, setFormData] = useState({
    namaLowongan: '',
    namaPerusahaan: '',
    tipe: '',
    lokasi: '',
    deadline: '',
    deskripsi: '',
    persyaratan: '',
    tentangPerusahaan: '',
    linkPendaftaran: '',
    emailPendaftaran: ''
  });

  const [logoPreview, setLogoPreview] = useState(null); 
  const [errors, setErrors] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  useEffect(() => {
    if (location.state && location.state.lowongan) {
      // Ambil field dari lowongan yang dikirim saat tombol edit diklik
      const { 
        id, 
        nama, 
        perusahaan, 
        tipe, 
        lokasi, 
        deadline, 
        deskripsi, 
        persyaratan, 
        tentangPerusahaan, 
        linkPendaftaran, 
        emailPendaftaran, 
        logo 
      } = location.state.lowongan;
      
      setLowonganId(id);
      
      // Set form data dengan fallback string kosong agar tidak undefined/hilang
      setFormData({
        namaLowongan: nama || '',
        namaPerusahaan: perusahaan || '',
        tipe: tipe || '',
        lokasi: lokasi || '',
        deadline: deadline || '',
        deskripsi: deskripsi || '',
        persyaratan: persyaratan || '',
        tentangPerusahaan: tentangPerusahaan || '',
        linkPendaftaran: linkPendaftaran || '',
        emailPendaftaran: emailPendaftaran || ''
      });
      
      // Mengunci preview logo lama agar langsung dirender visualnya
      if (logo) {
        setLogoPreview(logo);
      } else {
        setLogoPreview(null);
      }
    } else {
      navigate('/dashboard-admin');
    }
  }, [location, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let tempErrors = {};
    if (!formData.namaLowongan.trim()) tempErrors.namaLowongan = 'Nama lowongan wajib diisi';
    if (!formData.namaPerusahaan.trim()) tempErrors.namaPerusahaan = 'Nama perusahaan wajib diisi';
    if (!formData.tipe.trim()) tempErrors.tipe = 'Tipe wajib diisi';
    if (!formData.lokasi.trim()) tempErrors.lokasi = 'Lokasi wajib diisi';
    if (!formData.deadline.trim()) tempErrors.deadline = 'Deadline wajib diisi';
    if (!formData.deskripsi.trim()) tempErrors.deskripsi = 'Deskripsi lowongan wajib diisi';
    if (!formData.persyaratan.trim()) tempErrors.persyaratan = 'Persyaratan wajib diisi';
    if (!formData.linkPendaftaran.trim() && !formData.emailPendaftaran.trim()) {
      tempErrors.linkPendaftaran = 'Wajib diisi *';
    }

    if (Object.keys(tempErrors).length > 0) {
      setErrors(tempErrors);
      setShowAlert(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setShowAlert(false);

    if (typeof setDataLowongan === 'function' && lowonganId) {
      setDataLowongan(prev => 
        prev.map(item => item.id === lowonganId ? {
          ...item,
          nama: formData.namaLowongan,
          perusahaan: formData.namaPerusahaan,
          tipe: formData.tipe,
          lokasi: formData.lokasi,          
          deadline: formData.deadline,      
          deskripsi: formData.deskripsi,    
          persyaratan: formData.persyaratan,
          tentangPerusahaan: formData.tentangPerusahaan, 
          linkPendaftaran: formData.linkPendaftaran,     
          emailPendaftaran: formData.emailPendaftaran,   
          logo: logoPreview 
        } : item)
      );
    }

    setIsSuccessOpen(true);
  };

  const handleSuccessClose = () => {
    setIsSuccessOpen(false);
    navigate('/dashboard-admin');
  };

  return (
    <div className="min-h-screen w-screen flex flex-col justify-between text-gray-200 bg-[#070314] font-sans overflow-x-hidden select-none">
      
      {/* NAVBAR */}
      <nav className="relative w-full bg-[#1b0d4f] pl-0 pr-6 h-16 flex justify-between items-center shadow-lg border-b border-purple-950/30 shrink-0">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center h-14">
          <img src={logoMK} alt="Logo" className="h-full w-auto object-contain drop-shadow-[0_0_10px_rgba(168,85,247,0.6)]" />
        </div>
        <div></div>
        <div className="flex items-center gap-2 text-sm text-purple-300">
          <div className="w-8 h-8 bg-purple-900/40 border border-purple-500/20 rounded-full flex items-center justify-center">
            <i className="far fa-user text-purple-400"></i>
          </div>
          <span>Yanto Admin</span>
        </div>
      </nav>

      {/* UTAMA */}
      <main className="flex-grow w-full py-8 px-10 flex flex-col gap-5">
        <div className="flex items-center">
          <button type="button" onClick={() => navigate('/dashboard-admin')} className="w-9 h-9 rounded-full border border-gray-400 flex items-center justify-center text-gray-400 hover:text-white hover:border-white transition-all cursor-pointer">
            <i className="fas fa-arrow-left text-base"></i>
          </button>
        </div>

        <h1 className="text-2xl font-bold text-white tracking-wide">Edit Lowongan</h1>

        {showAlert && (
          <div className="w-full bg-red-950/40 border border-red-500/50 p-4 rounded-xl flex items-center gap-3 text-red-400 text-sm font-semibold">
            <i className="fas fa-circle-exclamation text-lg"></i>
            <span>Harap lengkapi semua field yang wajib diisi</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full bg-[#0d0722]/60 border border-purple-950/40 rounded-2xl p-8 space-y-5 shadow-2xl">
          
          {/* Logo Perusahaan */}
          <div>
            <label className="text-purple-300/60 text-xs font-semibold block mb-2 uppercase tracking-wider">Logo perusahaan</label>
            <input 
              type="file" 
              id="logo-edit-input" 
              accept=".jpg, .jpeg, .png" 
              onChange={handleLogoChange} 
              className="hidden" 
            />
            <label htmlFor="logo-edit-input" className="flex items-center gap-5 p-4 border border-purple-900/30 bg-[#130933]/20 rounded-xl cursor-pointer hover:border-purple-500/30 transition-colors group">
              <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center p-2 text-black text-xs font-bold text-center shrink-0 overflow-hidden">
                {logoPreview ? (
                  <img src={logoPreview} alt="Preview Logo Baru" className="w-full h-full object-contain" />
                ) : (
                  <div className="w-full h-full bg-blue-600 rounded-full flex items-center justify-center text-white font-black text-xl">
                    {formData.namaPerusahaan ? formData.namaPerusahaan.substring(0, 3).toUpperCase() : 'IMG'}
                  </div>
                )}
              </div>
              <span className="text-purple-300/50 text-sm group-hover:text-purple-300 transition-colors">
                {logoPreview ? 'Ubah Logo Perusahaan (.jpg/.png)' : 'Upload Logo Perusahaan baru (.jpg/.png)'}
              </span>
            </label>
          </div>

          {/* Nama Lowongan */}
          <div>
            <label className="text-purple-300/60 text-xs font-semibold block mb-2 uppercase tracking-wider">Nama lowongan <span className="text-red-500">*</span></label>
            <input type="text" name="namaLowongan" value={formData.namaLowongan} onChange={handleChange} className={`w-full bg-[#130933]/30 border ${errors.namaLowongan ? 'border-red-500' : 'border-purple-900/40'} rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/60 transition-colors`} />
            {errors.namaLowongan && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.namaLowongan}</p>}
          </div>

          {/* Nama Perusahaan */}
          <div>
            <label className="text-purple-300/60 text-xs font-semibold block mb-2 uppercase tracking-wider">Nama perusahaan <span className="text-red-500">*</span></label>
            <input type="text" name="namaPerusahaan" value={formData.namaPerusahaan} onChange={handleChange} className={`w-full bg-[#130933]/30 border ${errors.namaPerusahaan ? 'border-red-500' : 'border-purple-900/40'} rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/60 transition-colors`} />
            {errors.namaPerusahaan && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.namaPerusahaan}</p>}
          </div>

          {/* Tipe & Lokasi */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-purple-300/60 text-xs font-semibold block mb-2 uppercase tracking-wider">Tipe <span className="text-red-500">*</span></label>
              <input type="text" name="tipe" value={formData.tipe} onChange={handleChange} className={`w-full bg-[#130933]/30 border ${errors.tipe ? 'border-red-500' : 'border-purple-900/40'} rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/60 transition-colors`} />
              {errors.tipe && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.tipe}</p>}
            </div>
            <div>
              <label className="text-purple-300/60 text-xs font-semibold block mb-2 uppercase tracking-wider">Lokasi <span className="text-red-500">*</span></label>
              <input type="text" name="lokasi" value={formData.lokasi} onChange={handleChange} className={`w-full bg-[#130933]/30 border ${errors.lokasi ? 'border-red-500' : 'border-purple-900/40'} rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/60 transition-colors`} />
              {errors.lokasi && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.lokasi}</p>}
            </div>
          </div>

          {/* Deadline */}
          <div>
            <label className="text-purple-300/60 text-xs font-semibold block mb-2 uppercase tracking-wider">Deadline <span className="text-red-500">*</span></label>
            <input type="date" name="deadline" value={formData.deadline} onChange={handleChange} className={`w-full bg-[#130933]/30 border ${errors.deadline ? 'border-red-500' : 'border-purple-900/40'} rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/60 transition-colors`} />
            {errors.deadline && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.deadline}</p>}
          </div>

          {/* Deskripsi */}
          <div>
            <label className="text-purple-300/60 text-xs font-semibold block mb-2 uppercase tracking-wider">Deskripsi lowongan <span className="text-red-500">*</span></label>
            <textarea name="deskripsi" rows={5} value={formData.deskripsi} onChange={handleChange} className={`w-full bg-[#130933]/30 border ${errors.deskripsi ? 'border-red-500' : 'border-purple-900/40'} rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/60 transition-colors resize-none leading-relaxed`} />
            {errors.deskripsi && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.deskripsi}</p>}
          </div>

          {/* Persyaratan */}
          <div>
            <label className="text-purple-300/60 text-xs font-semibold block mb-2 uppercase tracking-wider">Persyaratan <span className="text-red-500">*</span></label>
            <textarea name="persyaratan" rows={5} value={formData.persyaratan} onChange={handleChange} className={`w-full bg-[#130933]/30 border ${errors.persyaratan ? 'border-red-500' : 'border-purple-900/40'} rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/60 transition-colors resize-none leading-relaxed`} />
            {errors.persyaratan && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.persyaratan}</p>}
          </div>

          {/* Tentang Perusahaan */}
          <div>
            <label className="text-purple-300/60 text-xs font-semibold block mb-2 uppercase tracking-wider">Tentang perusahaan</label>
            <textarea name="tentangPerusahaan" rows={4} value={formData.tentangPerusahaan} onChange={handleChange} className="w-full bg-[#130933]/30 border border-purple-900/40 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/60 transition-colors resize-none leading-relaxed" />
          </div>

          {/* Link & Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-purple-300/60 text-xs font-semibold block mb-2 uppercase tracking-wider">Link pendaftaran</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400/50 text-sm"><i className="fas fa-link"></i></span>
                <input type="text" name="linkPendaftaran" value={formData.linkPendaftaran} onChange={handleChange} className={`w-full bg-[#130933]/30 border ${errors.linkPendaftaran ? 'border-red-500' : 'border-purple-900/40'} rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/60 transition-colors`} />
              </div>
              {errors.linkPendaftaran && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.linkPendaftaran}</p>}
            </div>
            <div>
              <label className="text-purple-300/60 text-xs font-semibold block mb-2 uppercase tracking-wider">Email pendaftaran</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400/50 text-sm"><i className="far fa-envelope"></i></span>
                <input type="email" name="emailPendaftaran" value={formData.emailPendaftaran} onChange={handleChange} className="w-full bg-[#130933]/30 border border-purple-900/40 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/60 transition-colors" />
              </div>
            </div>
          </div>

          {/* Tombol Aksi */}
          <div className="grid grid-cols-2 gap-5 pt-4">
            <button type="button" onClick={() => navigate('/dashboard-admin')} className="w-full bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700 text-white font-bold text-sm py-3.5 rounded-xl transition-all cursor-pointer">Batal</button>
            <button type="submit" className="w-full bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 hover:brightness-110 text-white font-bold text-sm py-3.5 rounded-xl transition-all cursor-pointer">Simpan Perubahan</button>
          </div>
        </form>
      </main>

      <footer className="w-full text-center py-4 text-[11px] text-purple-400/30 bg-[#140b35] border-t border-purple-950/40 shrink-0">
        &copy;2026 Portal Magang & PKL
      </footer>

      {/* POP UP MODAL */}
      {isSuccessOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-[#070314]/70 backdrop-blur-sm" onClick={handleSuccessClose}></div>
          <div className="relative bg-[#150d33] border border-purple-950 rounded-2xl p-8 w-full max-w-sm shadow-[0_0_40px_rgba(0,0,0,0.7)] text-center backdrop-blur-md">
            <div className="flex justify-center mb-5">
              <div className="w-16 h-16 rounded-full flex items-center justify-center border-2 bg-purple-950/30 border-purple-500/50 text-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.4)]">
                <i className="text-2xl fas fa-circle-check"></i>
              </div>
            </div>
            <h3 className="text-white font-semibold text-lg mb-2 tracking-wide">Perubahan Berhasil Disimpan!</h3>
            <p className="text-gray-400 text-sm px-2 mb-6 leading-relaxed">Data lowongan kerja telah diperbarui dengan sukses ke dalam sistem pusat.</p>
            <button type="button" onClick={handleSuccessClose} className="w-full bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 hover:brightness-110 text-white font-bold text-sm py-3 rounded-xl transition-all cursor-pointer">Selesai</button>
          </div>
        </div>
      )}
    </div>
  );
}