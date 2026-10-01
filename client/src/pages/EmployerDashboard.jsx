import { useEffect, useState } from 'react';
import { api, BASE } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';

const TYPES = ['Full-time', 'Part-time', 'Contract', 'Remote', 'Internship'];
const STATUSES = ['Submitted', 'Reviewing', 'Shortlisted', 'Rejected', 'Hired'];
const empty = { title: '', location: '', type: 'Full-time', salary: '', description: '', requirements: '', featured: false };

export default function EmployerDashboard() {
  const { user, setUser } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState(empty);
  const [open, setOpen] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [msg, setMsg] = useState('');
  const [company, setCompany] = useState(user.company || '');
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

  const load = () => api('/jobs/mine').then(setJobs).catch(() => {});
  useEffect(() => { load(); }, []);

  const post = async (e) => {
    e.preventDefault(); setMsg('');
    try {
      await api('/jobs', { method: 'POST', body: { ...form, company: user.company } });
      setForm(empty); setMsg('Job posted!'); load();
    } catch (x) { setMsg(x.message); }
  };
  const remove = async (id) => {
    if (confirm('Delete this job?')) { await api('/jobs/' + id, { method: 'DELETE' }); load(); }
  };
  const toggle = async (id) => {
    if (open === id) return setOpen(null);
    setOpen(id); setApplicants(await api('/applications/job/' + id));
  };
  const setStatus = async (id, status) => {
    await api(`/applications/${id}/status`, { method: 'PATCH', body: { status } });
    setApplicants(applicants.map((a) => (a._id === id ? { ...a, status } : a)));
  };
  const saveProfile = async () =>
    setUser(await api('/auth/me', { method: 'PUT', body: { name: user.name, headline: user.headline, bio: user.bio, company } }));

  return (
    <div className="space-y-8">
      <h1 className="text-3xl">Employer dashboard</h1>
      <div className="card flex flex-col gap-3 sm:flex-row">
        <input className="input" placeholder="Company name" value={company} onChange={(e) => setCompany(e.target.value)} />
        <button className="btn" onClick={saveProfile}>Save company</button>
      </div>
      <div className="grid gap-8 lg:grid-cols-5">
        <form onSubmit={post} className="card h-fit space-y-3 lg:col-span-2">
          <h2 className="text-xl">Post a new job</h2>
          <input className="input" placeholder="Job title" required value={form.title} onChange={set('title')} />
          <input className="input" placeholder="Location" required value={form.location} onChange={set('location')} />
          <select className="input" value={form.type} onChange={set('type')}>{TYPES.map((t) => <option key={t}>{t}</option>)}</select>
          <input className="input" placeholder="Salary (e.g. $80k-$100k)" value={form.salary} onChange={set('salary')} />
          <textarea className="input" rows="4" placeholder="Description" required value={form.description} onChange={set('description')} />
          <textarea className="input" rows="3" placeholder="Requirements (one per line)" value={form.requirements} onChange={set('requirements')} />
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.featured} onChange={set('featured')} /> Featured on home page</label>
          {msg && <p className="text-sm text-indigo-600">{msg}</p>}
          <button className="btn w-full">Publish job</button>
        </form>
        <div className="space-y-4 lg:col-span-3">
          <h2 className="text-xl">Your listings ({jobs.length})</h2>
          {jobs.length === 0 && <p className="card">You haven't posted any jobs yet.</p>}
          {jobs.map((j) => (
            <div key={j._id} className="card">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div><h3>{j.title}</h3><p className="text-sm">{j.location} · <span className="badge">{j.type}</span></p></div>
                <div className="flex gap-2">
                  <button className="btn-outline" onClick={() => toggle(j._id)}>{open === j._id ? 'Hide' : 'Applicants'}</button>
                  <button className="btn-outline !text-red-600" onClick={() => remove(j._id)}>Delete</button>
                </div>
              </div>
              {open === j._id && (
                <div className="mt-4 space-y-3 border-t pt-4">
                  {applicants.length === 0 && <p className="text-sm">No applicants yet.</p>}
                  {applicants.map((a) => (
                    <div key={a._id} className="flex flex-col gap-2 rounded-xl bg-slate-50 p-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="text-sm">
                        <p className="font-semibold text-slate-900">{a.candidate.name} <span className="font-normal">· {a.candidate.email}</span></p>
                        {a.coverLetter && <p className="line-clamp-2">{a.coverLetter}</p>}
                        <a className="font-semibold text-indigo-600" href={BASE + a.resume} target="_blank" rel="noreferrer">Download resume</a>
                      </div>
                      <select className="input sm:w-40" value={a.status} onChange={(e) => setStatus(a._id, e.target.value)}>
                        {STATUSES.map((s) => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
