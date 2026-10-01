export const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export async function api(path, { method = 'GET', body, form } = {}) {
  const headers = {};
  const t = localStorage.getItem('token');
  if (t) headers.Authorization = 'Bearer ' + t;
  if (body) headers['Content-Type'] = 'application/json';
  const res = await fetch(BASE + '/api' + path, { method, headers, body: form || (body && JSON.stringify(body)) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}
