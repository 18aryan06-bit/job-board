import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import auth from './routes/auth.js';
import jobs from './routes/jobs.js';
import apps from './routes/applications.js';

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());
app.use('/uploads', express.static(path.resolve('uploads')));
app.use('/api/auth', auth);
app.use('/api/jobs', jobs);
app.use('/api/applications', apps);
app.use((e, req, res, next) => res.status(e.status || 500).json({ message: e.message }));

mongoose.connect(process.env.MONGO_URI)
  .then(() => app.listen(process.env.PORT || 5000, () => console.log('API running')))
  .catch((e) => { console.error(e); process.exit(1); });
