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

  useEffect(() => {
    const fetchJobDetail = async () => {
      try {
        const response = await api.get(`/internships/${id}`);
        const mappedJob = mapInternshipToJob(response.data.data);

        setJob(mappedJob);

        try {
          const bookmarksResponse = await api.get("/bookmarks");
          const savedList = bookmarksResponse.data.data || [];

          const isSaved = savedList.some((item) => {
            return (
              item.internship_id === mappedJob.id ||
              item.internship?.id === mappedJob.id ||
              item.id === mappedJob.id
            );
          });

          setSaved(isSaved);
        } catch (bookmarkError) {
          console.error("Gagal mengecek bookmark:", bookmarkError);
          setSaved(false);
        }
      } catch (error) {
        console.error("Gagal mengambil detail lowongan:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetail();
  }, [id]);

  const handleSaveJob = async () => {
    if (!job || saving) return;

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

  const requirementList = job.requirements
    ? job.requirements.split(",").map((item) => item.trim())
    : [];

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
              <img src={job.logo || job.image} alt={job.company} />
            </div>

            <div className="detail-main-info">
              <h1>{job.title}</h1>
              <p>{job.company}</p>

              <div className="detail-meta">
                <span>
                  <MapPin size={14} />
                  {job.location}
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
              <span className="detail-type-badge">{job.type}</span>

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
                disabled={saving}
              >
                <Bookmark size={24} />
              </button>
            </div>
          </div>

          <section className="detail-section">
            <h2>Deskripsi pekerjaan</h2>
            <p>{job.description}</p>
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
              {job.registrationUrl && (
                <p>
                  <LinkIcon size={14} />
                  <span>{job.registrationUrl}</span>
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