import express, { Application, Request, Response } from 'express';
import { authMiddleware } from './middleware/auth.middleware';
import { errorMiddleware } from './middleware/error.middleware';
import { createLoggerMiddleware } from './middleware/logger.middleware';
import routes from './routes';

export function createApp(): Application {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(createLoggerMiddleware());
  app.use(authMiddleware);

  app.use('/api/v1', routes);

  app.get('/', (_req: Request, res: Response) => {
    res.json({
      service: 'Aku IG Hub',
      version: '1.0.0',
      description: 'Integration Gateway Hub for the Aku platform',
    });
  });

  app.use(errorMiddleware);

  return app;
}
