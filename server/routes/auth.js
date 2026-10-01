import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models.js';
import { protect } from '../middleware/auth.js';

const r = Router();
const out = (u) => ({ token: jwt.sign({ id: u._id }, process.env.JWT_SECRET, { expiresIn: '7d' }),
  user: { _id: u._id, name: u.name, email: u.email, role: u.role, company: u.company, headline: u.headline, bio: u.bio } });

r.post('/register', async (req, res) => {
  const { name, email, password, role, company } = req.body;
  if (!name || !email || !password || password.length < 6)
    return res.status(400).json({ message: 'Name, email and a 6+ char password are required' });
  if (await User.findOne({ email: email.toLowerCase() })) return res.status(400).json({ message: 'Email already registered' });
  const u = await User.create({ name, email, role: role === 'employer' ? 'employer' : 'candidate', company,
    password: await bcrypt.hash(password, 10) });
  res.status(201).json(out(u));
});

r.post('/login', async (req, res) => {
  const u = await User.findOne({ email: (req.body.email || '').toLowerCase() });
  if (!u || !(await bcrypt.compare(req.body.password || '', u.password)))
    return res.status(401).json({ message: 'Invalid credentials' });
  res.json(out(u));
});

r.get('/me', protect, (req, res) => res.json(req.user));

r.put('/me', protect, async (req, res) => {
  const { name, headline, bio, company } = req.body;
  Object.assign(req.user, { name, headline, bio, company });
  await req.user.save();
  res.json(req.user);
});

export default r;
