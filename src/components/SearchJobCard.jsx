import { Briefcase, MapPin, Bookmark } from "lucide-react";
import { useNavigate } from "react-router-dom";

function SearchJobCard({ job }) {
  const navigate = useNavigate();

  return (
    <article className="search-job-card">
      <div className="search-job-logo">
        <img src={job.image} alt={job.company} />
      </div>

      <div className="search-job-info">
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
        </div>
      </div>

      <div className="search-job-right">
        <div className="bookmark-placeholder">
          {job.isSaved && (
            <Bookmark size={32} className="bookmark-icon active" />
          )}
        </div>

        <button
          className="detail-btn"
          onClick={() => navigate(`/detail-lowongan/${job.id}`)}
        >
          Lihat Detail
        </button>
      </div>
    </article>
  );
}

export default SearchJobCard;