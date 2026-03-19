import { Router } from 'express';
import healthRoutes from './health.routes';
import integrationRoutes from './integration.routes';
import orchestrationRoutes from './orchestration.routes';
import gatewayRoutes from './gateway.routes';

const router = Router();

router.use('/health', healthRoutes);
router.use('/integrations', integrationRoutes);
router.use('/orchestration', orchestrationRoutes);
router.use('/gateway', gatewayRoutes);

export default router;
