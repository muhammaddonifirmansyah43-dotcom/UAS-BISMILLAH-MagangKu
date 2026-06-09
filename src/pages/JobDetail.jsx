import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Bookmark,
  CalendarDays,
  CheckCircle,
  Link as LinkIcon,
  Mail,
  MapPin,
} from "lucide-react";

import api from "../api/api";
import { mapInternshipToJob } from "../api/jobMapper";

function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const defaultLogo = "/images/logo-agrowisata.jpeg";

  useEffect(() => {
    fetchJobDetail();
  }, [id]);

  const fetchJobDetail = async () => {
    try {
      setLoading(true);

      const response = await api.get(`/internships/${id}`);
      const jobData = response.data.data || response.data;
      const mappedJob = mapInternshipToJob(jobData);

      setJob(mappedJob);

      try {
        const bookmarksResponse = await api.get("/bookmarks");
        const savedList = bookmarksResponse.data.data || [];

        const isSaved = savedList.some((item) => {
          return (
            item.internship_id === mappedJob.id ||
            item.internship?.id === mappedJob.id
          );
        });

        setSaved(isSaved);
      } catch (bookmarkError) {
        console.error("Gagal mengecek bookmark:", bookmarkError);
        setSaved(false);
      }
    } catch (error) {
      console.error("Gagal mengambil detail lowongan:", error);

      if (error.response?.status === 401) {
        alert("Sesi login kamu sudah habis. Silakan login ulang.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      }

      setJob(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveJob = async () => {
    if (!job || saving) return;

    if (job.status !== "open") {
      alert("Lowongan ini sudah ditutup dan tidak bisa disimpan.");
      return;
    }

    try {
      setSaving(true);

      if (saved) {
        await api.delete(`/bookmarks/${job.id}`);
        setSaved(false);
      } else {
        await api.post(`/bookmarks/${job.id}`);
        setSaved(true);
      }

      window.dispatchEvent(new Event("savedJobsUpdated"));
    } catch (error) {
      console.error("Gagal menyimpan/menghapus lowongan:", error);

      if (error.response?.status === 401) {
        alert("Sesi login kamu sudah habis. Silakan login ulang.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      } else {
        alert("Gagal memproses bookmark. Coba lagi ya.");
      }
    } finally {
      setSaving(false);
    }
  };

  const formatRequirements = (requirements) => {
    if (!requirements) return [];

    return requirements
      .split(/\n|,/)
      .map((item) => item.trim())
      .filter(Boolean);
  };

  if (loading) {
    return (
      <div className="detail-page">
        <main className="detail-container">
          <p className="loading-text">Memuat detail lowongan...</p>
        </main>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="detail-page">
        <main className="detail-container">
          <button
            type="button"
            className="detail-back-btn"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={22} />
          </button>

          <p className="loading-text">Detail lowongan tidak ditemukan.</p>
        </main>
      </div>
    );
  }

  const requirementList = formatRequirements(job.requirements);

  return (
    <div className="detail-page">
      <main className="detail-container">
        <section className="detail-card">
          <button
            type="button"
            className="detail-back-btn"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={22} />
          </button>

          <div className="detail-header">
            <div className="detail-logo">
              <img
                src={job.logo || defaultLogo}
                alt={job.company || "Logo perusahaan"}
                onError={(e) => {
                  e.currentTarget.src = defaultLogo;
                }}
              />
            </div>

            <div className="detail-main-info">
              <h1>{job.title || "Nama Lowongan"}</h1>
              <p>{job.company || "Nama Perusahaan"}</p>

              <div className="detail-meta">
                <span>
                  <MapPin size={14} />
                  {job.location || "-"}
                </span>

                {job.closeDate && (
                  <span>
                    <CalendarDays size={14} />
                    {job.closeDate}
                  </span>
                )}
              </div>
            </div>

            <div className="detail-header-actions">
              <span className="detail-type-badge">{job.type || "-"}</span>

              <span
                className={
                  job.status === "open"
                    ? "detail-status-open"
                    : "detail-status-closed"
                }
              >
                {job.status === "open" ? "Buka" : "Tutup"}
              </span>

              <button
                type="button"
                className={`detail-save-btn ${saved ? "saved" : ""}`}
                onClick={handleSaveJob}
                disabled={saving || job.status !== "open"}
                title={
                  job.status === "open"
                    ? "Simpan lowongan"
                    : "Lowongan sudah ditutup"
                }
              >
                <Bookmark size={24} />
              </button>
            </div>
          </div>

          {job.status !== "open" && (
            <div className="detail-closed-alert">
              Lowongan ini sudah ditutup oleh admin.
            </div>
          )}

          <section className="detail-section">
            <h2>Deskripsi pekerjaan</h2>
            <p>{job.description || "Deskripsi belum tersedia."}</p>
          </section>

          <section className="detail-section">
            <h2>Persyaratan</h2>

            <ul className="requirement-list">
              {requirementList.length > 0 ? (
                requirementList.map((item, index) => (
                  <li key={index}>
                    <CheckCircle size={14} />
                    <span>{item}</span>
                  </li>
                ))
              ) : (
                <li>
                  <CheckCircle size={14} />
                  <span>Belum ada persyaratan khusus.</span>
                </li>
              )}
            </ul>
          </section>

          <section className="detail-section">
            <h2>Tentang perusahaan</h2>
            <p>
              {job.companyData?.description ||
                "Informasi perusahaan belum tersedia."}
            </p>
          </section>

          <section className="detail-section">
            <h2>Info pendaftaran</h2>

            <div className="registration-info">
              {job.registrationUrl ? (
                <p>
                  <LinkIcon size={14} />
                  <span>{job.registrationUrl}</span>
                </p>
              ) : (
                <p>
                  <LinkIcon size={14} />
                  <span>Link pendaftaran belum tersedia.</span>
                </p>
              )}

              {job.companyData?.email && (
                <p>
                  <Mail size={14} />
                  <span>{job.companyData.email}</span>
                </p>
              )}
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}

export default JobDetail;