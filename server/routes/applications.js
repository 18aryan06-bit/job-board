import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Application, Job } from '../models.js';
import { protect, role } from '../middleware/auth.js';
import { sendMail } from '../utils/mailer.js';

fs.mkdirSync('uploads', { recursive: true });
const allowed = ['.pdf', '.doc', '.docx'];
const upload = multer({
  storage: multer.diskStorage({
    destination: 'uploads',
    filename: (req, f, cb) => cb(null, `${Date.now()}-${Math.round(Math.random() * 1e6)}${path.extname(f.originalname).toLowerCase()}`),
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, f, cb) => {
    const good = allowed.includes(path.extname(f.originalname).toLowerCase());
    cb(good ? null : new Error('Only PDF/DOC/DOCX allowed'), good);
  },
});

const r = Router();

r.post('/:jobId', protect, role('candidate'),
  (req, res, next) => upload.single('resume')(req, res, (e) => (e ? res.status(400).json({ message: e.message }) : next())),
  async (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'Resume file is required' });
    const job = await Job.findById(req.params.jobId).catch(() => null);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (await Application.findOne({ job: job._id, candidate: req.user._id }))
      return res.status(400).json({ message: 'You already applied to this job' });
    const a = await Application.create({ job: job._id, candidate: req.user._id,
      coverLetter: req.body.coverLetter, resume: `/uploads/${req.file.filename}` });
    sendMail(req.user.email, `Application received: ${job.title}`,
      `Hi ${req.user.name},\n\nYour application for ${job.title} at ${job.company} was submitted successfully.`);
    res.status(201).json(a);
  });

r.get('/mine', protect, role('candidate'), async (req, res) => {
  res.json(await Application.find({ candidate: req.user._id }).populate('job', 'title company location type').sort('-createdAt'));
});

r.get('/job/:jobId', protect, role('employer'), async (req, res) => {
  const job = await Job.findOne({ _id: req.params.jobId, employer: req.user._id });
  if (!job) return res.status(404).json({ message: 'Job not found' });
  res.json(await Application.find({ job: job._id }).populate('candidate', 'name email headline').sort('-createdAt'));
});

r.patch('/:id/status', protect, role('employer'), async (req, res) => {
  const a = await Application.findById(req.params.id).populate('job').populate('candidate', 'name email');
  if (!a || String(a.job.employer) !== String(req.user._id)) return res.status(404).json({ message: 'Not found' });
  if (!Application.schema.path('status').enumValues.includes(req.body.status)) return res.status(400).json({ message: 'Invalid status' });
  a.status = req.body.status;
  await a.save();
  sendMail(a.candidate.email, `Application update: ${a.job.title}`,
    `Hi ${a.candidate.name},\n\nYour application for ${a.job.title} is now: ${a.status}.`);
  res.json({ _id: a._id, status: a.status });
});

export default r;
