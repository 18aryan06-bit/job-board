import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import Jobs from './pages/Jobs.jsx';
import JobDetail from './pages/JobDetail.jsx';
import { Login, Register } from './pages/AuthPages.jsx';
import EmployerDashboard from './pages/EmployerDashboard.jsx';
import CandidateDashboard from './pages/CandidateDashboard.jsx';

function Protected({ role, children }) {
  const { user, loading } = useAuth();
  if (loading) return <p className="p-10 text-center">Loading…</p>;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  const { user } = useAuth();
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <Register />} />
          <Route path="/dashboard" element={
            <Protected>{user?.role === 'employer' ? <EmployerDashboard /> : <CandidateDashboard />}</Protected>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
