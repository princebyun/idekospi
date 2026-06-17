import { Request, Response, NextFunction } from 'express';

const requestCounts = new Map<string, { count: number; resetTime: number }>();

export const rateLimiter = (req: Request, res: Response, next: NextFunction) => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 100;

  let record = requestCounts.get(ip);

  if (!record || now > record.resetTime) {
    record = { count: 1, resetTime: now + windowMs };
    requestCounts.set(ip, record);
  } else {
    record.count++;
  }

  // Cleanup old entries randomly to prevent memory leak
  if (Math.random() < 0.01) {
    for (const [key, value] of requestCounts.entries()) {
      if (now > value.resetTime) {
        requestCounts.delete(key);
      }
    }
  }

  if (record.count > maxRequests) {
    res.status(429).json({ error: 'Too Many Requests' });
    return;
  }

  next();
};
