
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function JobDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [err, setErr] = useState('');
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (id === '1' || id === '2' || id === '3') {
      const dummyJobs = {
        '1': { 
          title: 'Frontend Developer', 
          company: 'Tech Corp', 
          location: 'Remote, Delhi', 
          type: 'Full-time',
          salary: '₹12L - ₹18L',
          description: 'This is the fronted development company in which you should have to design the layout of the webpage by using the Html and CSS.', 
          requirements: ['2+ years of experience with React', 'Strong proficiency in JavaScript and CSS', 'Experience with responsive design']
        },
        '2': { 
          title: 'Backend Engineer', 
          company: 'Web Solutions', 
          location: 'Remote, Bangalore', 
          type: 'Full-time',
          salary: '₹15L - ₹22L',
          description: 'This is a backend developer job in which you have to handle the MongoDB APIs and node.js operations .', 
          requirements: ['Solid experience with Node.js and Express', 'Database management with MongoDB', 'RESTful API design and security']
        },
        '3': { 
          title: 'React Developer', 
          company: 'Startup Hub', 
          location: 'Delhi', 
          type: 'Contract',
          salary: '₹10L - ₹15L',
          description: 'This is React Developer job u should have fast-paced startup environment .', 
          requirements: ['Proficient in React.js and state management', 'Familiarity with Vite and modern build tools', 'Good problem-solving skills']
        }
      };
      setJob(dummyJobs[id]);
    } else {
      api('/jobs/' + id).then(setJob).catch((e) => setErr(e.message));
    }
  }, [id]);

  const apply = async (e) => {
    e.preventDefault();
    const form = e.target;
    setBusy(true); setMsg({ type: '', text: '' });
    try {
      await api('/applications/' + id, { method: 'POST', form: new FormData(form) });
      setMsg({ type: 'ok', text: 'Application submitted! A confirmation email is on its way.' });
      form.reset();
    } catch (x) { setMsg({ type: 'err', text: x.message }); }
    setBusy(false);
  };

  if (err) return <p className="card text-center">{err}</p>;
  if (!job) return <p className="text-center">Loading…</p>;

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="card lg:col-span-2">
        <span className="badge">{job.type}</span>
        <h1 className="mt-3 text-3xl">{job.title}</h1>
        <p className="mt-1 font-medium text-slate-700">{job.company} · 📍 {job.location}{job.salary && ` · 💰 ${job.salary}`}</p>
        <h2 className="mb-2 mt-8 text-xl">About the role</h2>
        <p className="whitespace-pre-line leading-relaxed">{job.description}</p>
        {job.requirements?.length > 0 && (
          <>
            <h2 className="mb-2 mt-8 text-xl">Requirements</h2>
            <ul className="list-disc space-y-1 pl-5">{job.requirements.map((r, i) => <li key={i}>{r}</li>)}</ul>
          </>
        )}
      </div>
      <aside className="card h-fit lg:sticky lg:top-24">
        <h2 className="mb-4 text-xl">Apply now</h2>
        {!user ? (
          <p className="text-sm">Please <Link className="font-semibold text-indigo-600" to="/login">log in</Link> or <Link className="font-semibold text-indigo-600" to="/register">register</Link> as a candidate to apply.</p>
        ) : user.role !== 'candidate' ? (
          <p className="text-sm">Only candidate accounts can apply.</p>
        ) : (
          <form onSubmit={apply} className="space-y-4">
            <textarea name="coverLetter" rows="4" className="input" placeholder="Resume / Summary (optional)" />
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Resume (PDF, DOC, DOCX, max 5MB)</label>
              <input name="resume" type="file" accept=".pdf,.doc,.docx" required className="block w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:font-semibold file:text-indigo-700" />
            </div>
            {msg.text && <p className={`text-sm ${msg.type === 'ok' ? 'text-green-600' : 'text-red-600'}`}>{msg.text}</p>}
            <button className="btn w-full" disabled={busy}>{busy ? 'Submitting…' : 'Submit application'}</button>
          </form>
        )}
      </aside>
    </div>
  );
}