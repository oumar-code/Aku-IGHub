import dotenv from 'dotenv';
import { AppConfig } from '../types';

dotenv.config();

export const config: AppConfig = {
  port: parseInt(process.env.PORT ?? '3000', 10),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  apiKey: process.env.API_KEY ?? 'dev-api-key',
  logLevel: process.env.LOG_LEVEL ?? 'info',
};
