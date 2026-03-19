import { Request, Response } from 'express';
import { OrchestrationService } from '../services/orchestration.service';
import { ApiResponse, Workflow } from '../types';

export const OrchestrationController = {
  listWorkflows(_req: Request, res: Response): void {
    const data = OrchestrationService.listWorkflows();
    const response: ApiResponse = { success: true, data };
    res.status(200).json(response);
  },

  getWorkflow(req: Request, res: Response): void {
    const workflow = OrchestrationService.getWorkflow(req.params.id);
    if (!workflow) {
      const response: ApiResponse = { success: false, error: 'Workflow not found' };
      res.status(404).json(response);
      return;
    }
    const response: ApiResponse = { success: true, data: workflow };
    res.status(200).json(response);
  },

  createWorkflow(req: Request, res: Response): void {
    const { name, description, steps } = req.body as {
      name?: string;
      description?: string;
      steps?: unknown[];
    };
    if (!name || !steps || !Array.isArray(steps)) {
      const response: ApiResponse = { success: false, error: 'name and steps are required' };
      res.status(400).json(response);
      return;
    }
    const workflow = OrchestrationService.createWorkflow({ name, description, steps: steps as Workflow['steps'] });
    const response: ApiResponse = { success: true, data: workflow };
    res.status(201).json(response);
  },

  deleteWorkflow(req: Request, res: Response): void {
    const deleted = OrchestrationService.deleteWorkflow(req.params.id);
    if (!deleted) {
      const response: ApiResponse = { success: false, error: 'Workflow not found' };
      res.status(404).json(response);
      return;
    }
    const response: ApiResponse = { success: true, message: 'Workflow deleted' };
    res.status(200).json(response);
  },

  async executeWorkflow(req: Request, res: Response): Promise<void> {
    try {
      const execution = await OrchestrationService.executeWorkflow(req.params.id, req.body);
      const response: ApiResponse = { success: true, data: execution };
      res.status(202).json(response);
    } catch (err) {
      const response: ApiResponse = {
        success: false,
        error: err instanceof Error ? err.message : 'Execution failed',
      };
      res.status(400).json(response);
    }
  },

  getExecution(req: Request, res: Response): void {
    const execution = OrchestrationService.getExecution(req.params.id);
    if (!execution) {
      const response: ApiResponse = { success: false, error: 'Execution not found' };
      res.status(404).json(response);
      return;
    }
    const response: ApiResponse = { success: true, data: execution };
    res.status(200).json(response);
  },
};
