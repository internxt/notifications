import { Express } from 'express';
export default function registerAuthApiMiddleware(app: Express) {
  app.use((req, res, next) => {
    const apiKeyHeader = req.headers['x-api-key'];

    if (apiKeyHeader !== process.env.API_KEY) return res.status(401).send();

    next();
  });
}
