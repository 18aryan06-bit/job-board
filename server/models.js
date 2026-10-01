import mongoose from 'mongoose';
const { Schema, model } = mongoose;

export const User = model('User', new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['candidate', 'employer'], default: 'candidate' },
  company: String, headline: String, bio: String,
}, { timestamps: true }));

export const Job = model('Job', new Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  type: { type: String, enum: ['Full-time', 'Part-time', 'Contract', 'Remote', 'Internship'], default: 'Full-time' },
  salary: String,
  description: { type: String, required: true },
  requirements: [String],
  featured: { type: Boolean, default: false },
  employer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true }));

export const Application = model('Application', new Schema({
  job: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
  candidate: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  coverLetter: String,
  resume: String,
  status: { type: String, enum: ['Submitted', 'Reviewing', 'Shortlisted', 'Rejected', 'Hired'], default: 'Submitted' },
}, { timestamps: true }));
