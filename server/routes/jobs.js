import { Router } from 'express';
import { Job, Application } from '../models.js';
import { protect, role } from '../middleware/auth.js';

const r = Router();
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

r.get('/', async (req, res) => {
  const { q, location, type, featured } = req.query;
  const f = {};
  if (q) f.$or = [{ title: new RegExp(esc(q), 'i') }, { company: new RegExp(esc(q), 'i') }];
  if (location) f.location = new RegExp(esc(location), 'i');
  if (type) f.type = type;
  if (featured) f.featured = true;
  res.json(await Job.find(f).sort('-createdAt').limit(100));
});

r.get('/mine', protect, role('employer'), async (req, res) => {
  res.json(await Job.find({ employer: req.user._id }).sort('-createdAt'));
});

r.get('/:id', async (req, res) => {
  const j = await Job.findById(req.params.id).catch(() => null);
  j ? res.json(j) : res.status(404).json({ message: 'Job not found' });
});

r.post('/', protect, role('employer'), async (req, res) => {
  const { title, company, location, type, salary, description, requirements, featured } = req.body;
  if (!title || !location || !description) return res.status(400).json({ message: 'Title, location and description required' });
  const reqs = Array.isArray(requirements) ? requirements : String(requirements || '').split('\n').map((s) => s.trim()).filter(Boolean);
  res.status(201).json(await Job.create({ title, location, type, salary, description, featured: !!featured,
    company: company || req.user.company || req.user.name, requirements: reqs, employer: req.user._id }));
});

r.delete('/:id', protect, role('employer'), async (req, res) => {
  const j = await Job.findOneAndDelete({ _id: req.params.id, employer: req.user._id });
  if (!j) return res.status(404).json({ message: 'Job not found' });
  await Application.deleteMany({ job: j._id });
  res.json({ ok: true });
});

export default r;
