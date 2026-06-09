import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Bookmark,
  Briefcase,
  MapPin,
  Trash2,
} from "lucide-react";

import api from "../api/api";
import { mapInternshipToJob } from "../api/jobMapper";

function SavedJobs() {
  const navigate = useNavigate();

  const [savedJobs, setSavedJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const defaultLogo = "/images/logo-agrowisata.jpeg";

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const mapBookmarkToJob = (bookmark) => {
    if (bookmark.internship) {
      return {
        ...mapInternshipToJob(bookmark.internship),
        bookmarkId: bookmark.id,
        internshipId: bookmark.internship.id,
      };
    }

    if (bookmark.title) {
      return {
        id: bookmark.internship_id || bookmark.id,
        bookmarkId: bookmark.id,
        internshipId: bookmark.internship_id || bookmark.id,
        title: bookmark.title || "Lowongan tersimpan",
        company: bookmark.company?.name || bookmark.company || "-",
        type: bookmark.type || "-",
        location: bookmark.location || "-",
        description: bookmark.description || "",
        requirements: bookmark.requirements || "",
        registrationUrl: bookmark.registration_url || "",
        status: bookmark.status || "open",
        openDate: bookmark.open_date || "",
        closeDate: bookmark.close_date || "",
        logo:
          bookmark.company?.logo_url ||
          bookmark.logo ||
          bookmark.image ||
          defaultLogo,
        companyData: bookmark.company,
      };
    }

    return {
      id: bookmark.internship_id || bookmark.id,
      bookmarkId: bookmark.id,
      internshipId: bookmark.internship_id || bookmark.id,
      title: "Lowongan tidak tersedia",
      company: "-",
      type: "-",
      location: "-",
      status: "closed",
      logo: defaultLogo,
    };
  };

  const fetchSavedJobs = async () => {
    try {
      setLoading(true);

      const response = await api.get("/bookmarks");
      const bookmarkData = response.data.data || [];
      const mappedJobs = bookmarkData.map(mapBookmarkToJob);

      setSavedJobs(mappedJobs);
    } catch (error) {
      console.error("Gagal mengambil lowongan tersimpan:", error);

      if (error.response?.status === 401) {
        alert("Sesi login kamu sudah habis. Silakan login ulang.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      setSavedJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDeleteModal = (job) => {
    setSelectedJob(job);
    setShowDeleteModal(true);
  };

  const handleDeleteJob = async () => {
    if (!selectedJob) return;

    try {
      const internshipId = selectedJob.internshipId || selectedJob.id;

      await api.delete(`/bookmarks/${internshipId}`);

      setSavedJobs((prev) =>
        prev.filter((job) => {
          const currentInternshipId = job.internshipId || job.id;
          return currentInternshipId !== internshipId;
        })
      );

      setSelectedJob(null);
      setShowDeleteModal(false);

      window.dispatchEvent(new Event("savedJobsUpdated"));
    } catch (error) {
      console.error("Gagal menghapus lowongan tersimpan:", error);
      console.log("Status:", error.response?.status);
      console.log("Data error:", error.response?.data);

      if (error.response?.status === 401) {
        alert("Sesi login kamu sudah habis. Silakan login ulang.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      } else {
        alert(
          error.response?.data?.message ||
            `Gagal menghapus lowongan. Status: ${
              error.response?.status || "unknown"
            }`
        );
      }
    }
  };

  const handleGoToDetail = (job) => {
    if (job.status === "closed") {
      alert("Lowongan ini sudah di tutup!");
      return;
    }

    const internshipId = job.internshipId || job.id;
    navigate(`/job-detail/${internshipId}`);
  };

  return (
    <div className="saved-login-page">
      <button
        type="button"
        className="saved-login-back"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={24} />
      </button>

      <main className="saved-login-container">
        <div className="saved-login-header">
          <h1>Lowongan tersimpan</h1>
          <Bookmark size={18} fill="white" />
        </div>

        <section className="saved-login-box">
          {loading ? (
            <div className="saved-login-empty">
              <div className="saved-empty-icon-new">
                <Bookmark size={36} />
              </div>

              <h2>Memuat lowongan tersimpan...</h2>
              <p>Mohon tunggu sebentar.</p>
            </div>
          ) : savedJobs.length > 0 ? (
            <div className="saved-login-list">
              {savedJobs.map((job) => (
                <article
                  key={`${job.bookmarkId || job.id}-${job.internshipId || job.id}`}
                  className={`saved-login-card ${
                    job.status === "closed" ? "saved-login-card-closed" : ""
                  }`}
                >
                  <div className="saved-login-logo">
                    <img
                      src={job.logo || defaultLogo}
                      alt={job.company || "Logo perusahaan"}
                      onError={(e) => {
                        e.currentTarget.src = defaultLogo;
                      }}
                    />
                  </div>

                  <div className="saved-login-info">
                    <h2>{job.title || "Lowongan tersimpan"}</h2>
                    <p>{job.company || "-"}</p>

                    <div className="saved-login-tags">
                      <span>
                        <Briefcase size={12} />
                        {job.type || "-"}
                      </span>

                      <span>
                        <MapPin size={12} />
                        {job.location || "-"}
                      </span>

                      <span
                        className={
                          job.status === "open"
                            ? "saved-tag-open"
                            : "saved-tag-closed"
                        }
                      >
                        {job.status === "open" ? "Buka" : "Tutup"}
                      </span>
                    </div>

                    {job.status === "closed" && (
                      <p className="saved-closed-text">
                        <span className="saved-warning-icon">!</span>
                        Lowongan ini sudah di tutup!
                      </p>
                    )}
                  </div>

                  <div className="saved-login-actions">
                    <button
                      type="button"
                      className={`saved-detail-btn ${
                        job.status === "closed" ? "saved-detail-disabled" : ""
                      }`}
                      onClick={() => handleGoToDetail(job)}
                      disabled={job.status === "closed"}
                    >
                      Lihat detail
                    </button>

                    <button
                      type="button"
                      className="saved-delete-link"
                      onClick={() => handleOpenDeleteModal(job)}
                    >
                      <Trash2 size={13} />
                      Hapus
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="saved-login-empty">
              <div className="saved-empty-icon-new">
                <Bookmark size={36} />
              </div>

              <h2>Belum ada lowongan tersimpan</h2>
              <p>Simpan lowongan terlebih dahulu dari halaman detail.</p>
            </div>
          )}
        </section>
      </main>

      {showDeleteModal && (
        <div className="saved-delete-overlay">
          <div className="saved-delete-modal">
            <div className="saved-delete-icon">
              <Trash2 size={24} />
            </div>

            <h2>Hapus Lowongan?</h2>

            <p>
              Apakah kamu yakin ingin menghapus lowongan ini dari daftar
              simpanan?
            </p>

            <div className="saved-delete-actions">
              <button
                type="button"
                className="saved-cancel-btn"
                onClick={() => setShowDeleteModal(false)}
              >
                Batal
              </button>

              <button
                type="button"
                className="saved-confirm-btn"
                onClick={handleDeleteJob}
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SavedJobs;