
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';
import JobCard from '../components/JobCard.jsx';

export default function Home() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    api('/jobs?featured=1')
      .then(async (f) => {
        const result = f.length ? f.slice(0, 6) : (await api('/jobs')).slice(0, 6);
        
        if (result.length === 0) {
          setJobs([
            { _id: '1', title: 'Frontend Developer', company: 'Tech Corp', location: 'Remote, Delhi' },
            { _id: '2', title: 'Backend Engineer', company: 'Web Solutions', location: 'Remote, Bangalore' },
            { _id: '3', title: 'React Developer', company: 'Startup Hub', location: 'Delhi' }
          ]);
        } else {
          setJobs(result);
        }
      })
      .catch(() => {
        setJobs([
          { _id: '1', title: 'Frontend Developer', company: 'Tech Corp', location: 'Remote, Delhi' },
          { _id: '2', title: 'Backend Engineer', company: 'Web Solutions', location: 'Remote, Bangalore' },
          { _id: '3', title: 'React Developer', company: 'Startup Hub', location: 'Delhi' }
        ]);
      });
  }, []);

  return (
    <>
      <section className="rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-800 px-6 py-16 text-center shadow-xl sm:py-24">
        <h1 className="mx-auto max-w-3xl text-4xl font-extrabold leading-tight !text-white sm:text-5xl lg:text-6xl">
          Weclome To JobBoard &nbsp;&nbsp;&nbsp; +600 Jobs
        </h1>
        <h3 className="mx-auto max-w-3xl py-5 text-2xl font-extrabold leading-tight !text-white sm:text-2xl lg:text-2xl">
          Find the job you'll love, or the talent you need.
        </h3>
        <p className="mx-auto mt-5 max-w-xl text-base text-indigo-100 sm:text-lg">
          Thousands of opportunities from great companies. Search, apply and track, all in one place.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link to="/jobs" className="inline-flex justify-center rounded-xl bg-white px-6 py-3 font-semibold text-indigo-700 shadow-md transition duration-200 hover:bg-indigo-50">Browse Jobs</Link>
          <Link to="/register" className="inline-flex justify-center rounded-xl border border-white/60 px-6 py-3 font-semibold text-white transition duration-200 hover:bg-white/10">Post a Job</Link>
        </div>
      </section>
      <section className="mt-14">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-2xl sm:text-3xl">Featured jobs</h2>
          <Link to="/jobs" className="text-sm font-semibold text-indigo-600">See all →</Link>
        </div>
        {jobs.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{jobs.map((j) => <JobCard key={j._id} job={j} />)}</div>
        ) : <p className="card text-center">No jobs posted yet. Employers can sign up to post the first one!</p>}
      </section>
    </>
  );
}
