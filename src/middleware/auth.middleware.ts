import { Request, Response, NextFunction } from 'express';
import { config } from '../config';
import { ApiResponse } from '../types';

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  // Skip auth for health check and root
  if (req.path === '/' || req.path.startsWith('/api/v1/health')) {
    return next();
  }

  const apiKey = req.headers['x-api-key'] as string | undefined;
  if (!apiKey || apiKey !== config.apiKey) {
    const response: ApiResponse = {
      success: false,
      error: 'Unauthorized: invalid or missing API key',
    };
    res.status(401).json(response);
    return;
  }

  next();
}
