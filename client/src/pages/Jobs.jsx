
import { useEffect, useState } from 'react';
import { api } from '../api.js';
import JobCard from '../components/JobCard.jsx';

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('');

  useEffect(() => {
    
    api('/jobs')
      .then((data) => {
        if (!data || data.length === 0) {
         
          setJobs([
            { _id: '1', title: 'Frontend Developer', company: 'Tech Corp', location: 'Remote, Delhi', type: 'Full-time', salary: '₹12L - ₹18L' },
            { _id: '2', title: 'Backend Engineer', company: 'Web Solutions', location: 'Remote, Bangalore', type: 'Full-time', salary: '₹15L - ₹22L' },
            { _id: '3', title: 'React Developer', company: 'Startup Hub', location: 'Delhi', type: 'Contract', salary: '₹10L - ₹15L' }
          ]);
        } else {
          setJobs(data);
        }
      })
      .catch(() => {
        
        setJobs([
          { _id: '1', title: 'Frontend Developer', company: 'Tech Corp', location: 'Remote, Delhi', type: 'Full-time', salary: '₹12L - ₹18L' },
          { _id: '2', title: 'Backend Engineer', company: 'Web Solutions', location: 'Remote, Bangalore', type: 'Full-time', salary: '₹15L - ₹22L' },
          { _id: '3', title: 'React Developer', company: 'Startup Hub', location: 'Delhi', type: 'Contract', salary: '₹10L - ₹15L' }
        ]);
      });
  }, []);

  const filteredJobs = jobs.filter((job) => {
    const matchSearch = job.title.toLowerCase().includes(search.toLowerCase()) || job.company.toLowerCase().includes(search.toLowerCase());
    const matchLocation = !location || job.location.toLowerCase().includes(location.toLowerCase());
    const matchType = !type || job.type === type;
    return matchSearch && matchLocation && matchType;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold">Search jobs</h1>
  
      <div className="card grid gap-4 md:grid-cols-4 bg-white p-4 rounded-xl shadow-sm">
        <input 
          className="input border p-2 rounded" 
          placeholder="Job title or company" 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
        />
        <input 
          className="input border p-2 rounded" 
          placeholder="Location" 
          value={location} 
          onChange={(e) => setLocation(e.target.value)} 
        />
        <select 
          className="input border p-2 rounded" 
          value={type} 
          onChange={(e) => setType(e.target.value)}
        >
          <option value="">All types</option>
          <option value="Full-time">Full-time</option>
          <option value="Contract">Contract</option>
          <option value="Remote">Remote</option>
        </select>
        <button 
          className="btn-outline border p-2 rounded" 
          onClick={() => { setSearch(''); setLocation(''); setType(''); }}
        >
          Clear filters
        </button>
      </div>

      {filteredJobs.length === 0 ? (
        <p className="text-center text-gray-500 py-10">No jobs match your search.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredJobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}