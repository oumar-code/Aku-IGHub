import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { Workflow, WorkflowExecution, StepResult } from '../types';
import { IntegrationService } from './integration.service';

const workflows = new Map<string, Workflow>();
const executions = new Map<string, WorkflowExecution>();

export const OrchestrationService = {
  listWorkflows(): Workflow[] {
    return Array.from(workflows.values());
  },

  getWorkflow(id: string): Workflow | undefined {
    return workflows.get(id);
  },

  createWorkflow(data: Omit<Workflow, 'id' | 'createdAt' | 'updatedAt'>): Workflow {
    const now = new Date().toISOString();
    const workflow: Workflow = {
      ...data,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
    };
    workflows.set(workflow.id, workflow);
    return workflow;
  },

  deleteWorkflow(id: string): boolean {
    return workflows.delete(id);
  },

  getExecution(id: string): WorkflowExecution | undefined {
    return executions.get(id);
  },

  async executeWorkflow(workflowId: string, input?: Record<string, unknown>): Promise<WorkflowExecution> {
    void input; // Reserved for future use: passing runtime input data to workflow steps
    const workflow = workflows.get(workflowId);
    if (!workflow) throw new Error(`Workflow ${workflowId} not found`);

    // Detect circular dependencies before execution
    const stepIds = new Set(workflow.steps.map((s) => s.id));
    const detectCycle = (stepId: string, visiting: Set<string>): boolean => {
      if (visiting.has(stepId)) return true;
      visiting.add(stepId);
      const step = workflow.steps.find((s) => s.id === stepId);
      for (const dep of step?.dependsOn ?? []) {
        if (stepIds.has(dep) && detectCycle(dep, visiting)) return true;
      }
      visiting.delete(stepId);
      return false;
    };
    for (const step of workflow.steps) {
      if (detectCycle(step.id, new Set())) {
        throw new Error(`Circular dependency detected in workflow ${workflowId}`);
      }
    }

    const now = new Date().toISOString();
    const stepResults: Record<string, StepResult> = {};
    for (const step of workflow.steps) {
      stepResults[step.id] = { stepId: step.id, status: 'pending' };
    }

    const execution: WorkflowExecution = {
      id: uuidv4(),
      workflowId,
      status: 'running',
      steps: stepResults,
      startedAt: now,
    };
    executions.set(execution.id, execution);

    // Execute steps (respecting dependsOn)
    try {
      const completed = new Set<string>();

      const executeStep = async (stepId: string): Promise<void> => {
        const step = workflow.steps.find((s) => s.id === stepId);
        if (!step) return;

        // Wait for dependencies
        if (step.dependsOn) {
          for (const dep of step.dependsOn) {
            if (!completed.has(dep)) {
              await executeStep(dep);
            }
          }
        }

        execution.steps[stepId].status = 'running';
        execution.steps[stepId].startedAt = new Date().toISOString();

        const integration = IntegrationService.get(step.integrationId);
        if (!integration) throw new Error(`Integration ${step.integrationId} not found`);

        const url = `${integration.baseUrl}${step.path}`;
        const headers: Record<string, string> = { ...integration.headers, ...step.headers };
        if (integration.authType === 'apiKey' && integration.authValue) {
          headers['x-api-key'] = integration.authValue;
        } else if (integration.authType === 'bearer' && integration.authValue) {
          headers['Authorization'] = `Bearer ${integration.authValue}`;
        }

        try {
          const response = await axios({ method: step.method, url, headers, data: step.body });
          execution.steps[stepId].data = response.data;
          execution.steps[stepId].status = 'completed';
          execution.steps[stepId].completedAt = new Date().toISOString();
          completed.add(stepId);
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          throw new Error(`Step "${step.name}" (${stepId}) failed: ${message}`);
        }
      };

      for (const step of workflow.steps) {
        if (!completed.has(step.id)) {
          await executeStep(step.id);
        }
      }

      execution.status = 'completed';
    } catch (err) {
      execution.status = 'failed';
      execution.error = err instanceof Error ? err.message : String(err);
    }

    execution.completedAt = new Date().toISOString();
    executions.set(execution.id, execution);
    return execution;
  },
};
