import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SearchJobCard from "../components/SearchJobCard";
import api from "../api/api";
import { mapInternshipToJob } from "../api/jobMapper";

function SearchJobs() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [activeType, setActiveType] = useState("Semua");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [showLocationFilter, setShowLocationFilter] = useState(false);
  const [loading, setLoading] = useState(true);

  const getSavedInternshipIds = (bookmarkData) => {
    return bookmarkData
      .map((bookmark) => {
        if (bookmark.internship_id) return bookmark.internship_id;
        if (bookmark.internship?.id) return bookmark.internship.id;
        return null;
      })
      .filter(Boolean);
  };

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

        const openJobs = response.data.data
          .map(mapInternshipToJob)
          .filter((job) => job.status === "open");

        let savedIds = [];

        try {
          const bookmarksResponse = await api.get("/bookmarks");
          const bookmarkData = bookmarksResponse.data.data || [];
          savedIds = getSavedInternshipIds(bookmarkData);
        } catch (bookmarkError) {
          console.error("Gagal mengambil data bookmark:", bookmarkError);
        }

        const jobsWithSavedStatus = openJobs.map((job) => ({
          ...job,
          isSaved: savedIds.includes(job.id),
        }));

        setJobs(jobsWithSavedStatus);
        setFilteredJobs(jobsWithSavedStatus);
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
    <div className="page">
      <Navbar />

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
                detailPath="/job-detail"
                isGuest={false}
              />
            ))
          ) : (
            <p className="loading-text">Lowongan tidak ditemukan</p>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default SearchJobs;