import jwt from 'jsonwebtoken';
import { User } from '../models.js';

export const protect = async (req, res, next) => {
  try {
    const t = (req.headers.authorization || '').replace('Bearer ', '');
    const { id } = jwt.verify(t, process.env.JWT_SECRET);
    req.user = await User.findById(id).select('-password');
    if (!req.user) throw new Error();
    next();
  } catch { res.status(401).json({ message: 'Not authorized' }); }
};

export const role = (r) => (req, res, next) =>
  req.user.role === r ? next() : res.status(403).json({ message: 'Forbidden' });
