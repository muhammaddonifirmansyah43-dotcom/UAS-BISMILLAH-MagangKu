import { useEffect, useState } from "react";
import { ArrowLeft, BookmarkX } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SavedJobCard from "../components/SavedJobCard";
import DeleteModal from "../components/DeleteModal";

function SavedJobs() {
  const navigate = useNavigate();

  const [savedJobs, setSavedJobs] = useState(() => {
    return JSON.parse(localStorage.getItem("savedJobs")) || [];
  });

  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    const storedSavedJobs = JSON.parse(localStorage.getItem("savedJobs")) || [];
    setSavedJobs(storedSavedJobs);
  }, []);

  const confirmDelete = () => {
    const updatedJobs = savedJobs.filter(
      (job) => job.id !== selectedJob.id
    );

    const removedJobs = JSON.parse(localStorage.getItem("removedJobs")) || [];

    const alreadyRemoved = removedJobs.some(
      (job) => job.id === selectedJob.id
    );

    const updatedRemovedJobs = alreadyRemoved
      ? removedJobs
      : [...removedJobs, selectedJob];

    localStorage.setItem("savedJobs", JSON.stringify(updatedJobs));
    localStorage.setItem("removedJobs", JSON.stringify(updatedRemovedJobs));

    setSavedJobs(updatedJobs);
    setSelectedJob(null);
  };

  return (
    <div className="page saved-page">
      <main className="saved-container">
        <div className="saved-page-header">
          <button className="saved-back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={16} />
          </button>

          <h1>Lowongan Tersimpan</h1>
        </div>

        {savedJobs.length === 0 ? (
          <section className="saved-empty">
            <div>
              <div className="saved-empty-icon">
                <BookmarkX size={34} />
              </div>

              <h3>Belum ada lowongan disimpan</h3>
              <p>Simpan lowongan yang menarik agar mudah ditemukan kembali</p>
            </div>
          </section>
        ) : (
          <section className="saved-list">
            {savedJobs.map((job) => (
              <SavedJobCard
                key={job.id}
                job={job}
                onDelete={setSelectedJob}
              />
            ))}
          </section>
        )}
      </main>

      {selectedJob && (
        <DeleteModal
          onCancel={() => setSelectedJob(null)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}

export default SavedJobs;