import { Briefcase, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

function JobCard({
  job,
  detailPath = "/job-detail",
  isGuest = false,
  onDetailClick,
}) {
  const navigate = useNavigate();

  const defaultLogo = "/images/logo-agrowisata.jpeg";

  const getLogo = () => {
    return (
      job?.logo ||
      job?.image ||
      job?.companyData?.logo_url ||
      defaultLogo
    );
  };

  const handleDetailClick = () => {
    if (isGuest && onDetailClick) {
      onDetailClick();
      return;
    }

    navigate(`${detailPath}/${job.id}`);
  };

  return (
    <article className="job-card">
      <img
        src={getLogo()}
        alt={job?.company || "Logo perusahaan"}
        onError={(e) => {
          e.currentTarget.src = defaultLogo;
        }}
      />

      <h3>{job?.title || "Nama Lowongan"}</h3>
      <p>{job?.company || "Nama Perusahaan"}</p>

      <div className="tags">
        <span className="tag">
          <Briefcase size={14} />
          {job?.type || "-"}
        </span>

        <span className="tag">
          <MapPin size={14} />
          {job?.location || "-"}
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