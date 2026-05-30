import { Briefcase, MapPin } from "lucide-react";

function JobCard({ job }) {
  return (
    <article className="job-card">
      <img src={job.image} alt={job.company} />

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

      <button className="primary-btn">Lihat Detail</button>
    </article>
  );
}

export default JobCard;