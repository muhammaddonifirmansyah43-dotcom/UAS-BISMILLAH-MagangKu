import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NavbarGuest from "../components/NavbarGuest";
import Footer from "../components/Footer";
import SearchJobCard from "../components/SearchJobCard";
import api from "../api/api";
import { mapInternshipToJob } from "../api/jobMapper";

function SearchJobsGuest() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [activeType, setActiveType] = useState("Semua");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [showLocationFilter, setShowLocationFilter] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [loading, setLoading] = useState(true);

  const filterJobs = (keyword, type, location, sourceJobs = jobs) => {
    let result = [...sourceJobs];

    if (keyword.trim() !== "") {
      result = result.filter(
        (job) =>
          job.title.toLowerCase().includes(keyword.toLowerCase()) ||
          job.company.toLowerCase().includes(keyword.toLowerCase())
      );
    }

    if (type !== "Semua") {
      result = result.filter((job) => job.type === type);
    }

    if (location) {
      result = result.filter((job) => job.location === location);
    }

    setFilteredJobs(result);
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);

        const response = await api.get("/internships");

        const mappedJobs = response.data.data
          .map(mapInternshipToJob)
          .filter((job) => job.status === "open");

        setJobs(mappedJobs);
        setFilteredJobs(mappedJobs);
      } catch (error) {
        console.error("Gagal mengambil data lowongan:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleSearch = () => {
    filterJobs(searchKeyword, activeType, selectedLocation);
  };

  const handleTypeFilter = (type) => {
    setActiveType(type);
    filterJobs(searchKeyword, type, selectedLocation);
  };

  const handleChooseLocation = (location) => {
    setSelectedLocation(location);
  };

  const handleApplyLocation = () => {
    filterJobs(searchKeyword, activeType, selectedLocation);
    setShowLocationFilter(false);
  };

  return (
    <div className="search-guest-page">
      <NavbarGuest />

      <main className="search-guest-container">
        <section className="search-guest-top">
          <input
            type="text"
            placeholder="Cari Lowongan"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />

          <button type="button" onClick={handleSearch}>
            Cari
          </button>
        </section>

        <section className="search-filter-row">
          {["Semua", "Magang", "PKL"].map((type) => (
            <button
              key={type}
              type="button"
              className={activeType === type ? "active" : ""}
              onClick={() => handleTypeFilter(type)}
            >
              {type}
            </button>
          ))}

          <div className="location-filter-wrapper">
            <button
              type="button"
              className="location-filter-btn"
              onClick={() => setShowLocationFilter(!showLocationFilter)}
            >
              Lokasi
            </button>

            {showLocationFilter && (
              <div className="location-dropdown">
                <h4>Pilih Lokasi</h4>

                {[
                  { label: "Pilih semua", value: "" },
                  { label: "Malang", value: "Malang" },
                  { label: "Batu", value: "Batu" },
                ].map((item) => (
                  <label className="location-option" key={item.label}>
                    <input
                      type="checkbox"
                      checked={selectedLocation === item.value}
                      onChange={() => handleChooseLocation(item.value)}
                    />
                    <span>{item.label}</span>
                  </label>
                ))}

                <button type="button" onClick={handleApplyLocation}>
                  Terapkan
                </button>
              </div>
            )}
          </div>
        </section>

        <section className="search-job-list">
          {loading ? (
            <p className="loading-text">Memuat lowongan...</p>
          ) : filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <SearchJobCard
                key={job.id}
                job={job}
                isGuest={true}
                onDetailClick={() => setShowLoginPopup(true)}
              />
            ))
          ) : (
            <p className="loading-text">Lowongan tidak ditemukan</p>
          )}
        </section>
      </main>

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

      <Footer />
    </div>
  );
}

export default SearchJobsGuest;