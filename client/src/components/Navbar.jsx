
import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const nav = useNavigate();
  const link = ({ isActive }) => `transition duration-200 hover:text-indigo-600 ${isActive ? 'text-indigo-600' : 'text-slate-600'}`;
  const close = () => setOpen(false);

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="text-xl font-extrabold text-slate-900">
          Job<span className="text-indigo-600">Board</span>
        </Link>
        <button className="rounded-lg p-2 text-slate-700 md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? '✕' : '☰'}
        </button>
        <nav className={`${open ? 'flex' : 'hidden'} absolute left-0 top-full w-full flex-col gap-4 border-b bg-white p-4 text-sm font-medium shadow-md md:static md:flex md:w-auto md:flex-row md:items-center md:border-0 md:p-0 md:shadow-none`}>
          <NavLink to="/jobs" className={link} onClick={close}>Search Jobs</NavLink>
          
          {user ? (
            <>
              {user.role === 'employer' ? (
                <NavLink to="/employer" className={link} onClick={close}>Employer Dashboard</NavLink>
              ) : (
                <NavLink to="/dashboard" className={link} onClick={close}>Candidate Dashboard</NavLink>
              )}
              <button className="btn-outline" onClick={() => { logout(); close(); nav('/'); }}>
                Logout
              </button>
            </>
          ) : (
            <>
              
              <NavLink to="/register?role=candidate" className={link} onClick={close}>Candidate Dashboard</NavLink>
              <NavLink to="/register?role=employer" className={link} onClick={close}>Employer Dashboard</NavLink>
              <NavLink to="/login" className={link} onClick={close}>Login</NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}