import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth'; // adjust path if needed

export default function adminOnly(req: AuthRequest, res: Response, next: NextFunction): void {
  if (!req.user || !req.user.isAdmin) {
    res.status(403).json({ message: 'Access denied' });
    return; // ✅ early return, but not returning the res object itself
  }
  next();
}
