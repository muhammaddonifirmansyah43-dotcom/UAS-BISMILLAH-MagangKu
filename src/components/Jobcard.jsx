import { Briefcase, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

function JobCard({
  job,
  detailPath = "/job-detail",
  isGuest = false,
  onDetailClick,
}) {
  const navigate = useNavigate();

  const handleDetailClick = () => {
    if (isGuest && onDetailClick) {
      onDetailClick();
      return;
    }

    navigate(`${detailPath}/${job.id}`);
  };

  return (
    <article className="job-card">
      <img src={job.logo || job.image} alt={job.company} />

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

      <button
        type="button"
        className={isGuest ? "guest-detail-btn" : "primary-btn"}
        onClick={handleDetailClick}
      >
        Lihat Detail
      </button>
    </article>
  );
}

export default JobCard;