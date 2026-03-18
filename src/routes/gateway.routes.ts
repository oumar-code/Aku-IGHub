import { Router } from 'express';
import { GatewayController } from '../controllers/gateway.controller';

const router = Router();

router.get('/routes', GatewayController.listRoutes);
router.get('/routes/:id', GatewayController.getRoute);
router.post('/routes', GatewayController.createRoute);
router.delete('/routes/:id', GatewayController.deleteRoute);
router.all('/proxy/*', GatewayController.proxy);

export default router;
