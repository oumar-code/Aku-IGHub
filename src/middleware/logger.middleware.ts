import morgan from 'morgan';
import { RequestHandler } from 'express';

export function createLoggerMiddleware(): RequestHandler {
  return morgan('combined');
}
