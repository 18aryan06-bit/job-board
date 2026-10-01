import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../api.js';

const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem('token')) return setLoading(false);
    api('/auth/me').then(setUser).catch(() => localStorage.removeItem('token')).finally(() => setLoading(false));
  }, []);

  const authenticate = async (path, body) => {
    const { token, user } = await api(path, { method: 'POST', body });
    localStorage.setItem('token', token);
    setUser(user);
    return user;
  };
  const logout = () => { localStorage.removeItem('token'); setUser(null); };

  return (
    <Ctx.Provider value={{ user, setUser, loading, logout,
      login: (b) => authenticate('/auth/login', b), register: (b) => authenticate('/auth/register', b) }}>
      {children}
    </Ctx.Provider>
  );
}
