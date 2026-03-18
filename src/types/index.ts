export interface Integration {
  id: string;
  name: string;
  type: 'http' | 'webhook' | 'grpc';
  baseUrl: string;
  headers?: Record<string, string>;
  authType?: 'none' | 'apiKey' | 'bearer' | 'basic';
  authValue?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowStep {
  id: string;
  name: string;
  integrationId: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  body?: Record<string, unknown>;
  headers?: Record<string, string>;
  dependsOn?: string[];
}

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  steps: WorkflowStep[];
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  steps: Record<string, StepResult>;
  startedAt: string;
  completedAt?: string;
  error?: string;
}

export interface StepResult {
  stepId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  data?: unknown;
  error?: string;
  startedAt?: string;
  completedAt?: string;
}

export interface GatewayRoute {
  id: string;
  name: string;
  matchPath: string;
  targetUrl: string;
  stripPrefix?: boolean;
  addHeaders?: Record<string, string>;
  methods?: Array<'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'ALL'>;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface AppConfig {
  port: number;
  nodeEnv: string;
  apiKey: string;
  logLevel: string;
}
