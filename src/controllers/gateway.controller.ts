import { Request, Response } from 'express';
import { GatewayService } from '../services/gateway.service';
import { ApiResponse, GatewayRoute } from '../types';

export const GatewayController = {
  listRoutes(_req: Request, res: Response): void {
    const data = GatewayService.listRoutes();
    const response: ApiResponse = { success: true, data };
    res.status(200).json(response);
  },

  getRoute(req: Request, res: Response): void {
    const route = GatewayService.getRoute(req.params.id);
    if (!route) {
      const response: ApiResponse = { success: false, error: 'Route not found' };
      res.status(404).json(response);
      return;
    }
    const response: ApiResponse = { success: true, data: route };
    res.status(200).json(response);
  },

  createRoute(req: Request, res: Response): void {
    const { name, matchPath, targetUrl, stripPrefix, addHeaders, methods } = req.body as {
      name?: string;
      matchPath?: string;
      targetUrl?: string;
      stripPrefix?: boolean;
      addHeaders?: Record<string, string>;
      methods?: string[];
    };
    if (!name || !matchPath || !targetUrl) {
      const response: ApiResponse = { success: false, error: 'name, matchPath, and targetUrl are required' };
      res.status(400).json(response);
      return;
    }
    const route = GatewayService.createRoute({
      name,
      matchPath,
      targetUrl,
      stripPrefix,
      addHeaders,
      methods: methods as GatewayRoute['methods'],
    });
    const response: ApiResponse = { success: true, data: route };
    res.status(201).json(response);
  },

  deleteRoute(req: Request, res: Response): void {
    const deleted = GatewayService.deleteRoute(req.params.id);
    if (!deleted) {
      const response: ApiResponse = { success: false, error: 'Route not found' };
      res.status(404).json(response);
      return;
    }
    const response: ApiResponse = { success: true, message: 'Route deleted' };
    res.status(200).json(response);
  },

  async proxy(req: Request, res: Response): Promise<void> {
    const route = GatewayService.findMatchingRoute(req.path, req.method);
    if (!route) {
      const response: ApiResponse = { success: false, error: 'No matching gateway route found' };
      res.status(404).json(response);
      return;
    }
    try {
      const data = await GatewayService.proxyRequest(route, req);
      res.status(200).json(data);
    } catch (err) {
      const response: ApiResponse = {
        success: false,
        error: err instanceof Error ? err.message : 'Proxy request failed',
      };
      res.status(502).json(response);
    }
  },
};
