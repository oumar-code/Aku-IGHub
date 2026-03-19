import { Router } from 'express';
import { OrchestrationController } from '../controllers/orchestration.controller';

const router = Router();

router.get('/workflows', OrchestrationController.listWorkflows);
router.get('/workflows/:id', OrchestrationController.getWorkflow);
router.post('/workflows', OrchestrationController.createWorkflow);
router.delete('/workflows/:id', OrchestrationController.deleteWorkflow);
router.post('/workflows/:id/execute', OrchestrationController.executeWorkflow);
router.get('/executions/:id', OrchestrationController.getExecution);

export default router;
