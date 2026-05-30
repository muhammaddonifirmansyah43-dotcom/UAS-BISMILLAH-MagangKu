import NavbarGuest from "../components/NavbarGuest";
import Footer from "../components/Footer";
import JobCard from "../components/JobCard";
import { recommendedJobs } from "../data/jobs";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";

function LandingPage() {
  return (
    <div className="page">
      <NavbarGuest />

      <main className="container">
        {/* HERO SECTION */}
        <section className="hero-section">
          <h1>
            Temukan Lowongan <span>Magang & PKL</span> Terbaik
          </h1>

          <p>
            Platform informasi magang dan PKL untuk mahasiswa.
            Daftar sekarang dan mulai kariermu.
          </p>

          <Link
            to="/cari-lowongan"
            className="hero-search-btn"
          >
            Cari Lowongan
            <Search size={18} />
          </Link>
        </section>

        {/* LOWONGAN TERBARU */}
        <section className="section-title">
          <h2>Lowongan Terbaru</h2>

          <Link to="/cari-lowongan">
            Lihat Semua
          </Link>
        </section>

        <section className="job-grid">
          {recommendedJobs.slice(0, 4).map((job) => (
            <JobCard
              key={job.id}
              job={job}
            />
          ))}
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default LandingPage;