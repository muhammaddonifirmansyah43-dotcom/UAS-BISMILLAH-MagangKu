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
  const [locations, setLocations] = useState([]);

  const [showLocationFilter, setShowLocationFilter] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);

      const response = await api.get("/internships");
      const internshipData = response.data.data || [];

      const openJobs = internshipData
        .map(mapInternshipToJob)
        .filter((job) => job.status === "open");

      const uniqueLocations = [
        ...new Set(
          openJobs
            .map((job) => job.location)
            .filter((location) => location && location.trim() !== "")
        ),
      ];

      setJobs(openJobs);
      setFilteredJobs(openJobs);
      setLocations(uniqueLocations);
    } catch (error) {
      console.error("Gagal mengambil data lowongan:", error);
      setJobs([]);
      setFilteredJobs([]);
      setLocations([]);
    } finally {
      setLoading(false);
    }
  };

  const filterJobs = (
    keyword = searchKeyword,
    type = activeType,
    location = selectedLocation,
    sourceJobs = jobs
  ) => {
    let result = [...sourceJobs];

    if (keyword.trim() !== "") {
      const lowerKeyword = keyword.toLowerCase();

      result = result.filter((job) => {
        const title = job.title || "";
        const company = job.company || "";
        const jobLocation = job.location || "";

        return (
          title.toLowerCase().includes(lowerKeyword) ||
          company.toLowerCase().includes(lowerKeyword) ||
          jobLocation.toLowerCase().includes(lowerKeyword)
        );
      });
    }

    if (type !== "Semua") {
      result = result.filter((job) => job.type === type);
    }

    if (location) {
      result = result.filter((job) => job.location === location);
    }

    setFilteredJobs(result);
  };

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

  const handleResetLocation = () => {
    setSelectedLocation("");
    filterJobs(searchKeyword, activeType, "");
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
            onChange={(e) => {
              setSearchKeyword(e.target.value);
              filterJobs(e.target.value, activeType, selectedLocation);
            }}
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
              {selectedLocation ? selectedLocation : "Lokasi"}
            </button>

            {showLocationFilter && (
              <div className="location-dropdown">
                <h4>Pilih Lokasi</h4>

                <label className="location-option">
                  <input
                    type="checkbox"
                    checked={selectedLocation === ""}
                    onChange={handleResetLocation}
                  />
                  <span>Pilih semua</span>
                </label>

                {locations.length > 0 ? (
                  locations.map((location) => (
                    <label className="location-option" key={location}>
                      <input
                        type="checkbox"
                        checked={selectedLocation === location}
                        onChange={() => handleChooseLocation(location)}
                      />
                      <span>{location}</span>
                    </label>
                  ))
                ) : (
                  <p className="location-empty">Belum ada lokasi</p>
                )}

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