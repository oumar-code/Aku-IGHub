import { v4 as uuidv4 } from 'uuid';
import axios, { AxiosRequestConfig } from 'axios';
import { Request } from 'express';
import { GatewayRoute } from '../types';

const routes = new Map<string, GatewayRoute>();

export const GatewayService = {
  listRoutes(): GatewayRoute[] {
    return Array.from(routes.values());
  },

  getRoute(id: string): GatewayRoute | undefined {
    return routes.get(id);
  },

  createRoute(data: Omit<GatewayRoute, 'id' | 'createdAt' | 'updatedAt'>): GatewayRoute {
    const now = new Date().toISOString();
    const route: GatewayRoute = {
      ...data,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
    };
    routes.set(route.id, route);
    return route;
  },

  deleteRoute(id: string): boolean {
    return routes.delete(id);
  },

  findMatchingRoute(path: string, method: string): GatewayRoute | undefined {
    return Array.from(routes.values()).find((r) => {
      const pathMatch = path.startsWith(r.matchPath);
      const methodMatch =
        !r.methods ||
        r.methods.includes('ALL') ||
        r.methods.includes(method.toUpperCase() as 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'ALL');
      return pathMatch && methodMatch;
    });
  },

  async proxyRequest(route: GatewayRoute, req: Request): Promise<unknown> {
    let targetPath = req.path;
    if (route.stripPrefix) {
      targetPath = targetPath.replace(route.matchPath, '') || '/';
    }
    const base = new URL(route.targetUrl);
    base.pathname = (base.pathname.replace(/\/$/, '') + targetPath) || '/';
    if (req.url.includes('?')) {
      base.search = '?' + req.url.split('?')[1];
    }
    const targetUrl = base.toString();

    const headers: Record<string, string> = {};
    for (const [key, value] of Object.entries(req.headers)) {
      if (typeof value === 'string' && key !== 'host') {
        headers[key] = value;
      }
    }
    if (route.addHeaders) {
      Object.assign(headers, route.addHeaders);
    }

    const config: AxiosRequestConfig = {
      method: req.method,
      url: targetUrl,
      headers,
      data: req.body,
      // Accept all status codes so error responses are proxied back to the client
      validateStatus: () => true,
    };

    const response = await axios(config);
    return response.data;
  },
};
