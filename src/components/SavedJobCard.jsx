import { Briefcase, MapPin, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

function SavedJobCard({ job, onDelete }) {
  const navigate = useNavigate();
  const isClosed = job.status === "Tutup";

  return (
    <article className={`saved-card ${isClosed ? "saved-card-closed" : ""}`}>
      <div className="saved-logo">
        <img src={job.image} alt={job.company} />
      </div>

      <div className="saved-info">
        <h3>{job.title}</h3>
        <p>{job.company}</p>

        <div className="tags">
          <span className="tag">
            <Briefcase size={14} />
            {job.type}
          </span>

          <span className="tag">
            <MapPin size={14} />
            {job.location}
          </span>

          <span className={isClosed ? "tag closed" : "tag success"}>
            {job.status}
          </span>
        </div>

        {isClosed && (
          <p className="closed-text">Lowongan ini sudah ditutup!</p>
        )}
      </div>

      <div className="saved-actions">
        <button
          type="button"
          className="saved-detail-link"
          onClick={() => navigate(`/detail-lowongan/${job.id}`)}
        >
          Lihat detail
        </button>

        <button
          type="button"
          className="saved-delete-btn"
          onClick={() => onDelete(job)}
        >
          <Trash2 size={16} />
          Hapus
        </button>
      </div>
    </article>
  );
}

export default SavedJobCard;