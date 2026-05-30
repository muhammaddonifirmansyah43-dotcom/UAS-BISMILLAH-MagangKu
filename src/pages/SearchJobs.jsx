import { useEffect, useMemo, useState } from "react";
import { SearchX, ChevronDown } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SearchJobCard from "../components/SearchJobCard";
import { allJobs } from "../data/jobs";

function SearchJobs() {
  const [keywordInput, setKeywordInput] = useState("");
  const [keyword, setKeyword] = useState("");

  const [location, setLocation] = useState("Semua");
  const [tempLocation, setTempLocation] = useState("Semua");

  const [type, setType] = useState("Semua");
  const [savedIds, setSavedIds] = useState([]);
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);

  useEffect(() => {
    const savedJobs = JSON.parse(localStorage.getItem("savedJobs")) || [];
    setSavedIds(savedJobs.map((job) => job.id));
  }, []);

  const filteredJobs = useMemo(() => {
    return allJobs
      .map((job) => ({
        ...job,
        isSaved: savedIds.includes(job.id),
      }))
      .filter((job) => {
        const keywordMatch =
          job.title.toLowerCase().includes(keyword.toLowerCase()) ||
          job.company.toLowerCase().includes(keyword.toLowerCase());

        const locationMatch = location === "Semua" || job.location === location;
        const typeMatch = type === "Semua" || job.type === type;

        return keywordMatch && locationMatch && typeMatch;
      });
  }, [keyword, location, type, savedIds]);

  const handleSearch = () => {
    setKeyword(keywordInput);
  };

  const handleLocationChange = (value) => {
    setTempLocation(value);
  };

  const applyLocationFilter = () => {
    setLocation(tempLocation);
    setLocationDropdownOpen(false);
  };

  const openLocationDropdown = () => {
    setTempLocation(location);
    setLocationDropdownOpen(!locationDropdownOpen);
  };

  return (
    <div className="page">
      <Navbar />

      <main className="search-page-container">
        <section className="search-top-bar">
          <input
            type="text"
            placeholder="Cari Lowongan"
            value={keywordInput}
            onChange={(event) => setKeywordInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") handleSearch();
            }}
          />

          <button type="button" onClick={handleSearch}>
            Cari
          </button>
        </section>

        <section className="search-filter-chips">
          <button
            className={type === "Semua" ? "filter-chip active" : "filter-chip"}
            onClick={() => setType("Semua")}
          >
            Semua
          </button>

          <button
            className={type === "Magang" ? "filter-chip active" : "filter-chip"}
            onClick={() => setType("Magang")}
          >
            Magang
          </button>

          <button
            className={type === "PKL" ? "filter-chip active" : "filter-chip"}
            onClick={() => setType("PKL")}
          >
            PKL
          </button>

          <div className="location-filter">
            <button
              type="button"
              className="filter-chip location-chip"
              onClick={openLocationDropdown}
            >
              <span>{location === "Semua" ? "Lokasi" : location}</span>
              <ChevronDown size={14} />
            </button>

            {locationDropdownOpen && (
              <div className="location-dropdown">
                <p>Pilih Lokasi</p>

                <label>
                  <input
                    type="checkbox"
                    checked={tempLocation === "Semua"}
                    onChange={() => handleLocationChange("Semua")}
                  />
                  Pilih semua
                </label>

                <label>
                  <input
                    type="checkbox"
                    checked={tempLocation === "Malang"}
                    onChange={() => handleLocationChange("Malang")}
                  />
                  Malang
                </label>

                <label>
                  <input
                    type="checkbox"
                    checked={tempLocation === "Batu"}
                    onChange={() => handleLocationChange("Batu")}
                  />
                  Batu
                </label>

                <button
                  type="button"
                  className="apply-location-btn"
                  onClick={applyLocationFilter}
                >
                  Terapkan
                </button>
              </div>
            )}
          </div>
        </section>

        {filteredJobs.length > 0 ? (
          <section className="search-job-list">
            {filteredJobs.map((job) => (
              <SearchJobCard key={job.id} job={job} />
            ))}
          </section>
        ) : (
          <section className="search-empty-state">
            <div>
              <div className="search-empty-icon">
                <SearchX size={42} />
              </div>

              <h3>Lowongan tidak ditemukan</h3>
              <p>Coba gunakan kata kunci lain atau ubah filter pencarian</p>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default SearchJobs;