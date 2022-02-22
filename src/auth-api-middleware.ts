import { Express } from 'express';
import Logger from './logger';
export default function registerAuthApiMiddleware(app: Express) {
  app.use((req, res, next) => {
    const logger = Logger.getInstance();

    const apiKeyHeader = req.headers['x-api-key'];

    if (apiKeyHeader !== process.env.API_KEY) {
      logger.warn(`Request unauthenticated X-API-KEY: ${apiKeyHeader}`);
      return res.status(401).send();
    }

    next();
  });
}
