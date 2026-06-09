import { useEffect, useState } from "react";
import { Briefcase, CalendarDays } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import JobCard from "../components/JobCard";

import api from "../api/api";
import { mapInternshipToJob } from "../api/jobMapper";

function Dashboard() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user")) || {};
  const userName = user.name || "Karim Benzema";

  const getSavedInternshipIds = (bookmarkData) => {
    return bookmarkData
      .map((bookmark) => {
        if (bookmark.internship_id) return bookmark.internship_id;
        if (bookmark.internship?.id) return bookmark.internship.id;
        return null;
      })
      .filter(Boolean);
  };

  const mapBookmarkToJob = (bookmark) => {
    if (bookmark.internship) {
      return mapInternshipToJob(bookmark.internship);
    }

    return {
      id: bookmark.internship_id,
      title: "Lowongan tersimpan",
      company: "-",
      type: "-",
      location: "-",
      status: "open",
      closeDate: null,
      logo: "/images/logo-agrowisata.jpeg",
    };
  };

  const getNearestDeadlineCount = (bookmarkedJobs) => {
    const openSavedJobs = bookmarkedJobs.filter(
      (job) => job.status === "open" && job.closeDate
    );

    return openSavedJobs.length;
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const internshipsResponse = await api.get("/internships");
      const internshipData = internshipsResponse.data.data || [];

      const openJobs = internshipData
        .map(mapInternshipToJob)
        .filter((job) => job.status === "open");

      let savedIds = [];
      let mappedSavedJobs = [];

      try {
        const bookmarksResponse = await api.get("/bookmarks");
        const bookmarkData = bookmarksResponse.data.data || [];

        savedIds = getSavedInternshipIds(bookmarkData);
        mappedSavedJobs = bookmarkData.map(mapBookmarkToJob);
      } catch (bookmarkError) {
        console.error("Gagal mengambil data bookmark:", bookmarkError);
      }

      const jobsWithSavedStatus = openJobs.map((job) => ({
        ...job,
        isSaved: savedIds.includes(job.id),
        logo: job.logo || "/images/logo-agrowisata.jpeg",
      }));

      setJobs(jobsWithSavedStatus);
      setSavedJobs(mappedSavedJobs);
    } catch (error) {
      console.error("Gagal mengambil data dashboard:", error);

      if (error.response?.status === 401) {
        alert("Sesi login kamu sudah habis. Silakan login ulang.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      setJobs([]);
      setSavedJobs([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <Navbar />

      <main className="container">
        <section className="welcome">
          <h1>Selamat datang kembali, {userName}!</h1>
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
              <strong>{getNearestDeadlineCount(savedJobs)}</strong>
            </div>
          </div>
        </section>

        <section className="section-title">
          <h2>Rekomendasi lowongan untuk kamu</h2>
          <Link to="/search-jobs">Lihat semua</Link>
        </section>

        <section className="job-grid">
          {loading ? (
            <p className="loading-text">Memuat lowongan...</p>
          ) : jobs.length > 0 ? (
            jobs.slice(0, 2).map((job) => (
              <JobCard
                key={job.id}
                job={job}
                detailPath="/job-detail"
                isGuest={false}
              />
            ))
          ) : (
            <p className="loading-text">Belum ada lowongan tersedia.</p>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Dashboard;