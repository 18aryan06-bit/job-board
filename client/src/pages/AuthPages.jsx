
import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function Form({ title, register }) {
  const { login, register: reg } = useAuth();
  const nav = useNavigate();
  const [searchParams] = useSearchParams();
  

  const initialRole = searchParams.get('role') || 'candidate';

  const [f, setF] = useState({ name: '', email: '', password: '', role: initialRole, company: '' });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  
  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam) {
      setF((prev) => ({ ...prev, role: roleParam }));
    }
  }, [searchParams]);

  const submit = async (e) => {
    e.preventDefault(); setBusy(true); setErr('');
    try { await (register ? reg(f) : login(f)); nav('/dashboard'); }
    catch (x) { setErr(x.message); setBusy(false); }
  };

  return (
    <form onSubmit={submit} className="card mx-auto mt-6 max-w-md space-y-4 shadow-xl">
      <h1 className="text-2xl">{title}</h1>
      {register && (
        <>
          <select className="input" value={f.role} onChange={set('role')}>
            <option value="candidate">I'm looking for a job</option>
            <option value="employer">I'm hiring</option>
          </select>
          <input className="input" placeholder="Full name" required value={f.name} onChange={set('name')} />
          {f.role === 'employer' && <input className="input" placeholder="Company name" value={f.company} onChange={set('company')} />}
        </>
      )}
      <input className="input" type="email" placeholder="Email" required value={f.email} onChange={set('email')} />
      <input className="input" type="password" placeholder="Password (min 6 chars)" required minLength={6} value={f.password} onChange={set('password')} />
      {err && <p className="text-sm text-red-600">{err}</p>}
      <button className="btn w-full" disabled={busy}>{busy ? 'Please wait…' : title}</button>
      <p className="text-center text-sm">
        {register ? <>Have an account? <Link className="font-semibold text-indigo-600" to="/login">Login</Link></>
          : <>New here? <Link className="font-semibold text-indigo-600" to="/register">Create account</Link></>}
      </p>
    </form>
  );
}

export const Login = () => <Form title="Login" />;
export const Register = () => <Form title="Register" register />;