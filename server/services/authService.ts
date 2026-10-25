import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Request, Response, NextFunction } from 'express';
import { db } from '../db/database';
import { config } from '../config';

export interface AdminPayload {
  userId: string;
  username: string;
  role: string;
}

export function generateToken(payload: AdminPayload): string {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: '7d' });
}

export function verifyToken(token: string): AdminPayload | null {
  try {
    return jwt.verify(token, config.jwtSecret) as AdminPayload;
  } catch {
    return null;
  }
}

export function authenticateAdmin(username: string, password: string): { token: string; user: AdminPayload } | null {
  const user = db.prepare('SELECT id, username, password_hash, role FROM users WHERE username = ?').get(username) as {
    id: string;
    username: string;
    password_hash: string;
    role: string;
  } | undefined;

  if (!user) return null;

  const valid = bcrypt.compareSync(password, user.password_hash);
  if (!valid) return null;

  const payload: AdminPayload = {
    userId: user.id,
    username: user.username,
    role: user.role,
  };

  const token = generateToken(payload);
  return { token, user: payload };
}

/**
 * Express middleware to enforce admin authentication on protected endpoints
 */
export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized: Missing or malformed authorization token' });
    return;
  }

  const token = authHeader.split(' ')[1];
  const payload = verifyToken(token);

  if (!payload || payload.role !== 'admin') {
    res.status(403).json({ error: 'Forbidden: Valid administrator credentials required' });
    return;
  }

  // Attach verified user to request
  (req as any).adminUser = payload;
  next();
}
