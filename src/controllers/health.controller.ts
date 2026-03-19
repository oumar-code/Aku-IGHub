import { Request, Response } from 'express';
import { ApiResponse } from '../types';

export const HealthController = {
  check(_req: Request, res: Response): void {
    const response: ApiResponse<{ status: string; timestamp: string; service: string }> = {
      success: true,
      data: {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'aku-ig-hub',
      },
    };
    res.status(200).json(response);
  },
};
