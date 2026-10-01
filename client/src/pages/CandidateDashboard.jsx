import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';

const color = { Submitted: 'bg-slate-100 text-slate-700', Reviewing: 'bg-amber-100 text-amber-700',
  Shortlisted: 'bg-indigo-100 text-indigo-700', Rejected: 'bg-red-100 text-red-700', Hired: 'bg-green-100 text-green-700' };

export default function CandidateDashboard() {
  const { user, setUser } = useAuth();
  const [apps, setApps] = useState([]);
  const [p, setP] = useState({ name: user.name || '', headline: user.headline || '', bio: user.bio || '' });
  const [saved, setSaved] = useState(false);

  useEffect(() => { api('/applications/mine').then(setApps).catch(() => {}); }, []);
  const save = async (e) => {
    e.preventDefault();
    setUser(await api('/auth/me', { method: 'PUT', body: p }));
    setSaved(true); setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl">Welcome, {user.name}</h1>
      <div className="grid gap-8 lg:grid-cols-5">
        <form onSubmit={save} className="card h-fit space-y-3 lg:col-span-2">
          <h2 className="text-xl">My profile</h2>
          <input className="input" placeholder="Full name" required value={p.name} onChange={(e) => setP({ ...p, name: e.target.value })} />
          <input className="input" placeholder="Headline (e.g. Frontend Developer)" value={p.headline} onChange={(e) => setP({ ...p, headline: e.target.value })} />
          <textarea className="input" rows="5" placeholder="About you" value={p.bio} onChange={(e) => setP({ ...p, bio: e.target.value })} />
          <button className="btn w-full">{saved ? 'Saved ✓' : 'Save profile'}</button>
        </form>
        <div className="space-y-4 lg:col-span-3">
          <h2 className="text-xl">My applications ({apps.length})</h2>
          {apps.length === 0 && <p className="card">No applications yet. <Link className="font-semibold text-indigo-600" to="/jobs">Browse jobs</Link></p>}
          {apps.map((a) => (
            <div key={a._id} className="card flex flex-wrap items-center justify-between gap-2">
              <div>
                {a.job ? <Link to={`/jobs/${a.job._id}`}><h3 className="hover:text-indigo-600">{a.job.title}</h3></Link> : <h3>Job removed</h3>}
                <p className="text-sm">{a.job?.company} · Applied {new Date(a.createdAt).toLocaleDateString()}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${color[a.status]}`}>{a.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
