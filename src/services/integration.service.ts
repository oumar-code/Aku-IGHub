import { v4 as uuidv4 } from 'uuid';
import { Integration } from '../types';

// In-memory store (replace with DB in production)
const integrations = new Map<string, Integration>();

export const IntegrationService = {
  list(): Integration[] {
    return Array.from(integrations.values());
  },

  get(id: string): Integration | undefined {
    return integrations.get(id);
  },

  create(data: Omit<Integration, 'id' | 'createdAt' | 'updatedAt'>): Integration {
    const now = new Date().toISOString();
    const integration: Integration = {
      ...data,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
    };
    integrations.set(integration.id, integration);
    return integration;
  },

  update(id: string, data: Partial<Omit<Integration, 'id' | 'createdAt'>>): Integration | undefined {
    const existing = integrations.get(id);
    if (!existing) return undefined;
    const updated: Integration = {
      ...existing,
      ...data,
      id: existing.id,
      createdAt: existing.createdAt,
      updatedAt: new Date().toISOString(),
    };
    integrations.set(id, updated);
    return updated;
  },

  delete(id: string): boolean {
    return integrations.delete(id);
  },
};
