import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types';

export function errorMiddleware(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  console.error('[Error]', err.message, err.stack);
  const response: ApiResponse = {
    success: false,
    error: err.message || 'Internal server error',
  };
  res.status(500).json(response);
}
