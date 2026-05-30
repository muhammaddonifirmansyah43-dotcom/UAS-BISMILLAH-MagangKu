import { Briefcase, CalendarDays } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import JobCard from "../components/JobCard";
import { recommendedJobs } from "../data/jobs";
import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <div className="page">
      <Navbar />

      <main className="container">
        <section className="welcome">
          <h1>Selamat datang kembali, Karim Benzema!</h1>
          <p>Temukan lowongan magang dan PKL terbaik untukmu</p>
        </section>

        <section className="stats">
          <div className="stat-card">
            <Briefcase />
            <div>
              <h3>Lamaran Aktif</h3>
              <strong>0</strong>
            </div>
          </div>

          <div className="stat-card">
            <CalendarDays />
            <div>
              <h3>Deadline Terdekat</h3>
              <small>Dari lowongan yang disimpan</small>
              <strong>0</strong>
            </div>
          </div>
        </section>

        <section className="section-title">
          <h2>Rekomendasi lowongan untuk kamu</h2>
          <Link to="/cari-lowongan">Lihat semua</Link>
        </section>

        <section className="job-grid">
          {recommendedJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Dashboard;