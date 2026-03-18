import { Router } from 'express';
import { IntegrationController } from '../controllers/integration.controller';

const router = Router();

router.get('/', IntegrationController.list);
router.get('/:id', IntegrationController.get);
router.post('/', IntegrationController.create);
router.put('/:id', IntegrationController.update);
router.delete('/:id', IntegrationController.delete);

export default router;
