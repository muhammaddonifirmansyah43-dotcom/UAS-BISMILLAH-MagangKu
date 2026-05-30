import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Bookmark,
  Briefcase,
  CalendarDays,
  CheckCircle,
  Link,
  Mail,
  MapPin,
} from "lucide-react";
import { allJobs } from "../data/jobs";

function JobDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  const job = allJobs.find((item) => item.id === Number(id));
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (!job) return;

    const savedJobs = JSON.parse(localStorage.getItem("savedJobs")) || [];
    const removedJobs = JSON.parse(localStorage.getItem("removedJobs")) || [];

    const existsInStorage = savedJobs.some((item) => item.id === job.id);
    const existsInRemoved = removedJobs.some((item) => item.id === job.id);

    if (existsInRemoved) {
      setIsSaved(false);
      return;
    }

    setIsSaved(existsInStorage || job.isSaved);
  }, [job]);

  const toggleSavedJob = () => {
    if (!job) return;

    const savedJobs = JSON.parse(localStorage.getItem("savedJobs")) || [];
    const removedJobs = JSON.parse(localStorage.getItem("removedJobs")) || [];

    if (isSaved) {
      const updatedSavedJobs = savedJobs.filter((item) => item.id !== job.id);

      const alreadyRemoved = removedJobs.some((item) => item.id === job.id);
      const updatedRemovedJobs = alreadyRemoved
        ? removedJobs
        : [...removedJobs, job];

      localStorage.setItem("savedJobs", JSON.stringify(updatedSavedJobs));
      localStorage.setItem("removedJobs", JSON.stringify(updatedRemovedJobs));
      setIsSaved(false);
    } else {
      const alreadySaved = savedJobs.some((item) => item.id === job.id);
      const updatedSavedJobs = alreadySaved ? savedJobs : [...savedJobs, job];

      const updatedRemovedJobs = removedJobs.filter(
        (item) => item.id !== job.id
      );

      localStorage.setItem("savedJobs", JSON.stringify(updatedSavedJobs));
      localStorage.setItem("removedJobs", JSON.stringify(updatedRemovedJobs));
      setIsSaved(true);
    }
  };

  if (!job) {
    return (
      <div className="page detail-page">
        <main className="detail-container">
<button className="detail-back-btn" onClick={() => navigate(-1)}>
  <span className="back-arrow-symbol">↩</span>
</button>
          <section className="empty-state">
            <div>
              <h3>Lowongan tidak ditemukan</h3>
              <p>Data lowongan yang kamu cari tidak tersedia.</p>
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="page detail-page">
      <main className="detail-container">
        <button className="detail-back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>

        <section className="detail-hero">
          <div className="detail-logo-small">
            <img src={job.image} alt={job.company} />
          </div>

          <div className="detail-title-area">
            <h1>{job.title}</h1>
            <p>{job.company}</p>

            <div className="detail-meta">
              <span>
                <MapPin size={14} />
                {job.location}
              </span>

              <span>
                <CalendarDays size={14} />
                {job.deadline}
              </span>
            </div>
          </div>

          <div className="detail-side-actions">
            <span className="detail-type-pill">{job.type}</span>
            <span className="detail-status-pill">{job.status}</span>

            <button className="detail-bookmark-btn" onClick={toggleSavedJob}>
              <Bookmark
                size={26}
                className={isSaved ? "bookmark-icon active" : "bookmark-icon"}
              />
            </button>
          </div>
        </section>

        <section className="detail-info-section">
          <h2>Deskripsi pekerjaan</h2>
          <p>
            {job.description ||
              "Membantu proses penginputan dan pengelolaan data perusahaan. Melakukan pengecekan dokumen administrasi dan arsip digital. Membantu tim operasional dalam kegiatan harian kantor. Berkoordinasi dengan divisi terkait untuk mendukung kelancaran pekerjaan."}
          </p>
        </section>

        <section className="detail-info-section">
          <h2>Persyaratan</h2>

          <ul className="requirement-list">
            {(job.requirements || [
              "Siswa/mahasiswa aktif jurusan terkait",
              "Mampu mengoperasikan Microsoft Office",
              "Teliti, disiplin, dan bertanggung jawab",
              "Memiliki kemampuan komunikasi yang baik",
            ]).map((item, index) => (
              <li key={index}>
                <CheckCircle size={15} />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="detail-info-section">
          <h2>Tentang Perusahaan</h2>
          <p>
            {job.company} merupakan perusahaan yang bergerak di bidang pelayanan
            dan pengembangan sumber daya manusia. Perusahaan ini berkomitmen
            memberikan pengalaman kerja dan pembelajaran yang profesional bagi
            peserta magang maupun PKL.
          </p>
        </section>

        <section className="detail-info-section">
          <h2>Info Pendaftaran</h2>

          <div className="registration-info">
            <p>
              <Link size={16} />
              https://magangku.id/karir/
              {job.title.toLowerCase().replaceAll(" ", "-")}
            </p>

            <p>
              <Mail size={16} />
              recruitment@magangku.id
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default JobDetail;