import { useEffect, useState } from "react";
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
} from "lucide-react";

import api from "../../api/api";
import "../../index.css";

import logo from "../../assets/Logo_MagangKu.png";
import userPhoto from "../../assets/Karim-Benzema-Profil.jpeg";
import lucaPhoto from "../../assets/Luca-Modric.png";
import lenyPhoto from "../../assets/Leny-Yoro.png";

import CloseJobModal from "../../components/admin/CloseJobModal";
import OpenJobModal from "../../components/admin/OpenJobModal";
import DeleteJobModal from "../../components/admin/DeleteJobModal";
import ResetPasswordModal from "../../components/admin/ResetPasswordModal";

function AdminDashboard() {
  const [jobs, setJobs] = useState([]);
  const [users, setUsers] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);

  const [selectedJob, setSelectedJob] = useState(null);
  const [modalType, setModalType] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);
  const [resetLoading, setResetLoading] = useState(false);

  useEffect(() => {
    fetchJobs();
    fetchUsersDummy();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoadingJobs(true);

      const response = await api.get("/internships");
      setJobs(response.data.data || []);
    } catch (error) {
      console.error("Gagal mengambil data lowongan:", error);
      alert("Gagal mengambil data lowongan");
    } finally {
      setLoadingJobs(false);
    }
  };

  const fetchUsersDummy = () => {
    setUsers([
      {
        id: 1,
        name: "Karim Benzema",
        email: "karimbenzema@gmail.com",
        photo: userPhoto,
      },
      {
        id: 2,
        name: "Luca Modric",
        email: "LucaModric@gmail.com",
        photo: lucaPhoto,
      },
      {
        id: 3,
        name: "Leny Yoro",
        email: "LenyYoro@gmail.com",
        photo: lenyPhoto,
      },
    ]);
  };

  const openModal = (type, job) => {
    setModalType(type);
    setSelectedJob(job);
  };

  const closeModal = () => {
    setModalType("");
    setSelectedJob(null);
  };

  const handleCloseJob = async () => {
    if (!selectedJob) return;

    try {
      setActionLoading(true);

      await api.patch(`/admin/internships/${selectedJob.id}/close`);
      await fetchJobs();

      closeModal();
    } catch (error) {
      console.error("Gagal menutup lowongan:", error);
      alert("Gagal menutup lowongan");
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenJob = async () => {
    if (!selectedJob) return;

    try {
      setActionLoading(true);

      await api.patch(`/admin/internships/${selectedJob.id}/open`);
      await fetchJobs();

      closeModal();
    } catch (error) {
      console.error("Gagal membuka lowongan:", error);
      alert("Gagal membuka lowongan");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteJob = async () => {
    if (!selectedJob) return;

    try {
      setActionLoading(true);

      await api.delete(`/admin/internships/${selectedJob.id}`);
      await fetchJobs();

      closeModal();
    } catch (error) {
      console.error("Gagal menghapus lowongan:", error);
      alert("Gagal menghapus lowongan");
    } finally {
      setActionLoading(false);
    }
  };

  const openResetPasswordModal = (user) => {
    setSelectedUser(user);
  };

  const closeResetPasswordModal = () => {
    setSelectedUser(null);
  };

  const handleResetPassword = async () => {
    if (!selectedUser) return;

    try {
      setResetLoading(true);

      /*
        Untuk sementara fitur ini belum disambungkan ke backend.
        Kalau backend reset password sudah dibuat, nanti request-nya bisa diganti menjadi:
        await api.patch(`/admin/users/${selectedUser.id}/reset-password`);
      */

      alert(`Link reset password untuk ${selectedUser.name} berhasil diproses.`);

      closeResetPasswordModal();
    } catch (error) {
      console.error("Gagal reset password:", error);
      alert("Gagal mengirim reset password");
    } finally {
      setResetLoading(false);
    }
  };

  const activeJobsCount = jobs.filter((job) => job.status === "open").length;

  return (
    <div className="admin-page">
      <header className="admin-navbar">
        <div className="admin-logo">
          <img src={logo} alt="MagangKu" />
        </div>

        <div className="admin-profile">
          <span className="admin-profile-icon">♡</span>
          <span>Admin</span>
          <span>⌄</span>
        </div>
      </header>

      <main className="admin-container">
        <section className="admin-welcome">
          <h1>Selamat datang kembali, Admin!</h1>
          <p>Berikut adalah ringkasan aktivitas dan statistik sistem terbaru</p>
        </section>

        <section className="admin-stats">
          <div className="admin-stat-card">
            <CheckCircle size={32} />
            <div>
              <p>Lowongan Aktif</p>
              <h2>{activeJobsCount}</h2>
            </div>
          </div>

          <div className="admin-stat-card">
            <Users size={32} />
            <div>
              <p>Total Mahasiswa/Siswa</p>
              <h2>{users.length}</h2>
            </div>
          </div>
        </section>

        <section className="admin-section">
          <div className="admin-section-header">
            <h2>Kelola lowongan</h2>

            <button type="button" className="admin-add-btn">
              <Plus size={16} />
              Tambah lowongan
            </button>
          </div>

          <div className="admin-table">
            <div className="admin-table-head admin-job-grid">
              <span>Nama lowongan</span>
              <span>Tipe</span>
              <span>Status</span>
              <span>Aksi</span>
            </div>

            {loadingJobs ? (
              <div className="admin-empty-row">Memuat lowongan...</div>
            ) : jobs.length > 0 ? (
              jobs.map((job) => (
                <div className="admin-table-row admin-job-grid" key={job.id}>
                  <div>
                    <h3>{job.title}</h3>
                    <p>{job.company?.name}</p>
                  </div>

                  <span className="admin-badge admin-badge-type">
                    {job.type}
                  </span>

                  <span
                    className={
                      job.status === "open"
                        ? "admin-badge admin-badge-open"
                        : "admin-badge admin-badge-closed"
                    }
                  >
                    {job.status === "open" ? "Buka" : "Tutup"}
                  </span>

                  <div className="admin-actions">
                    <button
                      type="button"
                      className="admin-action-btn edit"
                      title="Edit lowongan"
                    >
                      <Edit size={16} />
                    </button>

                    {job.status === "open" ? (
                      <button
                        type="button"
                        className="admin-action-btn close"
                        title="Tutup lowongan"
                        onClick={() => openModal("close", job)}
                      >
                        <XCircle size={16} />
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="admin-action-btn open"
                        title="Buka lowongan"
                        onClick={() => openModal("open", job)}
                      >
                        <Check size={16} />
                      </button>
                    )}

                    <button
                      type="button"
                      className="admin-action-btn delete"
                      title="Hapus lowongan"
                      onClick={() => openModal("delete", job)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="admin-empty-row">Belum ada data lowongan</div>
            )}
          </div>
        </section>

        <section className="admin-section">
          <div className="admin-section-header">
            <h2>Kelola pengguna</h2>

            <div className="admin-user-search">
              <Search size={13} />
              <input type="text" placeholder="Cari pengguna..." />
            </div>
          </div>

          <div className="admin-table">
            <div className="admin-table-head admin-user-grid">
              <span>Nama</span>
              <span>Email</span>
              <span>Aksi</span>
            </div>

            {users.map((user) => (
              <div className="admin-table-row admin-user-grid" key={user.id}>
                <div className="admin-user-info">
                  <div className="admin-user-avatar">
                    {user.photo ? (
                      <img src={user.photo} alt={user.name} />
                    ) : (
                      <span className="admin-user-avatar-fallback">
                        {user.name.charAt(0)}
                      </span>
                    )}
                  </div>

                  <h3>{user.name}</h3>
                </div>

                <span>{user.email}</span>

                <div className="admin-actions">
                  <button
                    type="button"
                    className="admin-action-btn reset"
                    title="Reset password"
                    onClick={() => openResetPasswordModal(user)}
                  >
                    <KeyRound size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="admin-footer">@2026 Portal Magang & PKL</footer>

      {modalType === "close" && (
        <CloseJobModal
          job={selectedJob}
          onClose={closeModal}
          onConfirm={handleCloseJob}
          loading={actionLoading}
        />
      )}

      {modalType === "open" && (
        <OpenJobModal
          job={selectedJob}
          onClose={closeModal}
          onConfirm={handleOpenJob}
          loading={actionLoading}
        />
      )}

      {modalType === "delete" && (
        <DeleteJobModal
          job={selectedJob}
          onClose={closeModal}
          onConfirm={handleDeleteJob}
          loading={actionLoading}
        />
      )}

      {selectedUser && (
        <ResetPasswordModal
          user={selectedUser}
          onClose={closeResetPasswordModal}
          onConfirm={handleResetPassword}
          loading={resetLoading}
        />
      )}
    </div>
  );
}

export default AdminDashboard;