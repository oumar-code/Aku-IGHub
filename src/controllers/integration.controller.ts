import { Request, Response } from 'express';
import { IntegrationService } from '../services/integration.service';
import { ApiResponse } from '../types';

export const IntegrationController = {
  list(_req: Request, res: Response): void {
    const data = IntegrationService.list();
    const response: ApiResponse = { success: true, data };
    res.status(200).json(response);
  },

  get(req: Request, res: Response): void {
    const integration = IntegrationService.get(req.params.id);
    if (!integration) {
      const response: ApiResponse = { success: false, error: 'Integration not found' };
      res.status(404).json(response);
      return;
    }
    const response: ApiResponse = { success: true, data: integration };
    res.status(200).json(response);
  },

  create(req: Request, res: Response): void {
    const { name, type, baseUrl, headers, authType, authValue } = req.body as {
      name?: string;
      type?: string;
      baseUrl?: string;
      headers?: Record<string, string>;
      authType?: string;
      authValue?: string;
    };
    if (!name || !type || !baseUrl) {
      const response: ApiResponse = { success: false, error: 'name, type, and baseUrl are required' };
      res.status(400).json(response);
      return;
    }
    if (!['http', 'webhook', 'grpc'].includes(type)) {
      const response: ApiResponse = { success: false, error: 'type must be http, webhook, or grpc' };
      res.status(400).json(response);
      return;
    }
    const integration = IntegrationService.create({
      name,
      type: type as 'http' | 'webhook' | 'grpc',
      baseUrl,
      headers,
      authType: authType as 'none' | 'apiKey' | 'bearer' | 'basic' | undefined,
      authValue,
    });
    const response: ApiResponse = { success: true, data: integration };
    res.status(201).json(response);
  },

  update(req: Request, res: Response): void {
    const updated = IntegrationService.update(req.params.id, req.body);
    if (!updated) {
      const response: ApiResponse = { success: false, error: 'Integration not found' };
      res.status(404).json(response);
      return;
    }
    const response: ApiResponse = { success: true, data: updated };
    res.status(200).json(response);
  },

  delete(req: Request, res: Response): void {
    const deleted = IntegrationService.delete(req.params.id);
    if (!deleted) {
      const response: ApiResponse = { success: false, error: 'Integration not found' };
      res.status(404).json(response);
      return;
    }
    const response: ApiResponse = { success: true, message: 'Integration deleted' };
    res.status(200).json(response);
  },
};
