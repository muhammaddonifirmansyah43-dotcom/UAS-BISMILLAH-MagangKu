import { useEffect, useState } from "react";
import NavbarGuest from "../components/NavbarGuest";
import Footer from "../components/Footer";
import JobCard from "../components/JobCard";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import api from "../api/api";
import { mapInternshipToJob } from "../api/jobMapper";

function LandingPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await api.get("/internships");
        const mappedJobs = response.data.data.map(mapInternshipToJob);
        setJobs(mappedJobs);
      } catch (error) {
        console.error("Gagal mengambil data lowongan:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="landing-page">
      <div className="landing-frame">
        <NavbarGuest />

        <main className="landing-content">
          <section className="hero-section">
            <h1>
              Temukan Lowongan <span>Magang & PKL</span> Terbaik
            </h1>

            <p>
              Platform informasi magang dan PKL untuk mahasiswa. Daftar sekarang
              dan mulai lamar!
            </p>

            <Link to="/cari-lowongan" className="hero-search-box">
              Cari Lowongan
              <ArrowRight size={16} />
            </Link>
          </section>

          <section className="section-title">
            <h2>Lowongan Terbaru</h2>
            <Link to="/cari-lowongan">Lihat Semua</Link>
          </section>

          <section className="job-grid">
            {loading ? (
              <p className="loading-text">Memuat lowongan...</p>
            ) : (
              jobs.slice(0, 2).map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  isGuest={true}
                  onDetailClick={() => setShowLoginPopup(true)}
                />
              ))
            )}
          </section>
        </main>

        <Footer />
      </div>

      {showLoginPopup && (
        <div className="guest-login-modal-overlay">
          <div className="guest-login-modal">
            <div className="guest-login-icon">🔒</div>

            <h2>Membutuhkan akses</h2>

            <p>
              Silakan login terlebih dahulu untuk melihat detail lowongan ini.
            </p>

            <Link to="/login" className="guest-login-btn">
              Login sekarang
            </Link>

            <Link to="/register" className="guest-register-btn">
              Daftar akun
            </Link>

            <button
              type="button"
              className="guest-later-btn"
              onClick={() => setShowLoginPopup(false)}
            >
              Nanti saja
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default LandingPage;