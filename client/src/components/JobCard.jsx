import { Link } from 'react-router-dom';

export default function JobCard({ job }) {
  return (
    <Link to={`/jobs/${job._id}`} className="card flex flex-col gap-3 hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-lg leading-snug">{job.title}</h3>
        <span className="badge shrink-0">{job.type}</span>
      </div>
      <p className="text-sm font-medium text-slate-700">{job.company}</p>
      <p className="text-sm">📍 {job.location}</p>
      {job.salary && <p className="text-sm">💰 {job.salary}</p>}
      <p className="line-clamp-2 text-sm">{job.description}</p>
      <span className="mt-auto pt-2 text-sm font-semibold text-indigo-600">View details →</span>
    </Link>
  );
}
