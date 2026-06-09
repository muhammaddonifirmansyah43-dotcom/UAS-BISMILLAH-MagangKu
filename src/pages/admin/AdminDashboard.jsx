import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  LogOut,
  ChevronDown,
} from "lucide-react";

import api from "../../api/api";
import "../../index.css";

import logo from "../../assets/Logo_MagangKu.png";

import CloseJobModal from "../../components/admin/CloseJobModal";
import OpenJobModal from "../../components/admin/OpenJobModal";
import DeleteJobModal from "../../components/admin/DeleteJobModal";
import ResetPasswordModal from "../../components/admin/ResetPasswordModal";

function AdminDashboard() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [users, setUsers] = useState([]);

  const [loadingJobs, setLoadingJobs] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);

  const [selectedJob, setSelectedJob] = useState(null);
  const [modalType, setModalType] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);
  const [resetLoading, setResetLoading] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [showAdminMenu, setShowAdminMenu] = useState(false);

  const defaultUserPhoto = "/images/default-user.png";

  useEffect(() => {
    fetchJobs();
    fetchUsers();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoadingJobs(true);

      const response = await api.get("/internships");
      setJobs(response.data.data || []);
    } catch (error) {
      console.error("Gagal mengambil data lowongan:", error);

      if (error.response?.status === 401) {
        alert("Sesi login admin habis. Silakan login ulang.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      alert("Gagal mengambil data lowongan");
    } finally {
      setLoadingJobs(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);

      const response = await api.get("/users");
      const userData = response.data.data || response.data || [];

      setUsers(userData);
    } catch (error) {
      console.error("Gagal mengambil data pengguna:", error);
      console.log("Status users:", error.response?.status);
      console.log("Data error users:", error.response?.data);

      if (error.response?.status === 401) {
        alert("Sesi login admin habis. Silakan login ulang.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      setUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleAddJob = () => {
    navigate("/admin/tambah-lowongan");
  };

  const handleEditJob = (job) => {
    navigate(`/admin/edit-lowongan/${job.id}`, {
      state: {
        job,
      },
    });
  };

  const handleLogout = async () => {
    try {
      await api.post("/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("data_lowongan_portal");

      navigate("/login");
    }
  };

  const openModal = (type, job) => {
    setModalType(type);
    setSelectedJob(job);
  };

  const closeModal = () => {
    setModalType("");
    setSelectedJob(null);
  };

  const buildInternshipPayload = (job, status) => {
    return {
      company_id: job.company_id || job.company?.id,
      title: job.title || "",
      type: job.type || "Magang",
      description: job.description || "",
      requirements: job.requirements || "",
      location: job.location || "",
      registration_url: job.registration_url || "",
      status: status,
      open_date: job.open_date || null,
      close_date: job.close_date || null,
    };
  };

  const handleCloseJob = async () => {
    if (!selectedJob) return;

    try {
      setActionLoading(true);

      await api.put(
        `/internships/${selectedJob.id}`,
        buildInternshipPayload(selectedJob, "closed")
      );

      await fetchJobs();
      closeModal();
    } catch (error) {
      console.error("Gagal menutup lowongan:", error);
      console.log("Status:", error.response?.status);
      console.log("Data error:", error.response?.data);

      alert(
        error.response?.data?.message ||
          `Gagal menutup lowongan. Status: ${
            error.response?.status || "unknown"
          }`
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenJob = async () => {
    if (!selectedJob) return;

    try {
      setActionLoading(true);

      await api.put(
        `/internships/${selectedJob.id}`,
        buildInternshipPayload(selectedJob, "open")
      );

      await fetchJobs();
      closeModal();
    } catch (error) {
      console.error("Gagal membuka lowongan:", error);
      console.log("Status:", error.response?.status);
      console.log("Data error:", error.response?.data);

      alert(
        error.response?.data?.message ||
          `Gagal membuka lowongan. Status: ${
            error.response?.status || "unknown"
          }`
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteJob = async () => {
    if (!selectedJob) return;

    try {
      setActionLoading(true);

      await api.delete(`/internships/${selectedJob.id}`);

      await fetchJobs();
      closeModal();
    } catch (error) {
      console.error("Gagal menghapus lowongan:", error);
      console.log("Status:", error.response?.status);
      console.log("Data error:", error.response?.data);

      alert(
        error.response?.data?.message ||
          `Gagal menghapus lowongan. Status: ${
            error.response?.status || "unknown"
          }`
      );
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

  const handleResetPassword = async (newPassword) => {
    if (!selectedUser) return;

    try {
      setResetLoading(true);

      await api.put(`/users/${selectedUser.id}/reset-password`, {
        password: newPassword,
      });

      alert(`Password untuk ${selectedUser.name} berhasil direset.`);

      closeResetPasswordModal();
    } catch (error) {
      console.error("Gagal reset password:", error);
      console.log("Status:", error.response?.status);
      console.log("Data error:", error.response?.data);

      if (error.response?.status === 401) {
        alert("Sesi login admin habis. Silakan login ulang.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      alert(
        error.response?.data?.message ||
          `Gagal reset password. Status: ${error.response?.status || "unknown"}`
      );
    } finally {
      setResetLoading(false);
    }
  };

  const activeJobsCount = jobs.filter((job) => job.status === "open").length;

  const studentUsers = users.filter((user) => {
    return user.role !== "admin";
  });

  const filteredUsers = studentUsers.filter((user) => {
    const keyword = userSearch.toLowerCase();

    return (
      (user.name || "").toLowerCase().includes(keyword) ||
      (user.email || "").toLowerCase().includes(keyword)
    );
  });

  const getUserPhoto = (user) => {
    return user.avatar_url || user.photo || defaultUserPhoto;
  };

  return (
    <div className="admin-page">
      <header className="admin-navbar">
        <div className="admin-logo">
          <img src={logo} alt="MagangKu" />
        </div>

        <div className="admin-profile">
          <button
            type="button"
            className="admin-profile-btn"
            onClick={() => setShowAdminMenu(!showAdminMenu)}
          >
            <span className="admin-profile-icon">♡</span>
            <span>Admin</span>
            <ChevronDown size={14} />
          </button>

          {showAdminMenu && (
            <div className="admin-profile-dropdown">
              <button type="button" onClick={handleLogout}>
                <LogOut size={14} />
                Logout
              </button>
            </div>
          )}
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
              <h2>{studentUsers.length}</h2>
            </div>
          </div>
        </section>

        <section className="admin-section">
          <div className="admin-section-header">
            <h2>Kelola lowongan</h2>

            <button
              type="button"
              className="admin-add-btn"
              onClick={handleAddJob}
            >
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
                    <p>{job.company?.name || "-"}</p>
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
                      onClick={() => handleEditJob(job)}
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
              <input
                type="text"
                placeholder="Cari pengguna..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="admin-table">
            <div className="admin-table-head admin-user-grid">
              <span>Nama</span>
              <span>Email</span>
              <span>Aksi</span>
            </div>

            {loadingUsers ? (
              <div className="admin-empty-row">Memuat pengguna...</div>
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <div className="admin-table-row admin-user-grid" key={user.id}>
                  <div className="admin-user-info">
                    <div className="admin-user-avatar">
                      {user.avatar_url || user.photo ? (
                        <img
                          src={getUserPhoto(user)}
                          alt={user.name || "User"}
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <span className="admin-user-avatar-fallback">
                          {(user.name || "U").charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>

                    <h3>{user.name || "-"}</h3>
                  </div>

                  <span>{user.email || "-"}</span>

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
              ))
            ) : (
              <div className="admin-empty-row">Pengguna tidak ditemukan</div>
            )}
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