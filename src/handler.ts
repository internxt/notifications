import type { Express } from 'express';
import type { Server } from 'socket.io';
import Logger from './logger';

type RequestBody = {
  event: string;
  payload: any;
  email?: string;
  userId?: string;
  clientId?: string;
};

function validateBody(body: Record<string, any>): RequestBody {
  if (body.event && body.payload && (body.email || body.userId)) return body as RequestBody;
  throw new Error('Body is not in the expected format');
}

export default function registerHandler(app: Express, io: Server) {
  app.post('/', (req, res) => {
    const logger = Logger.getInstance();

    let body: RequestBody;
    try {
      body = validateBody(req.body);
    } catch (err) {
      logger.warn('Validation failed', (err as Error).message, JSON.stringify(req.body, null, 2));
      return res.status(400).send();
    }

    logger.info(`Event is going to be emited: ${JSON.stringify(body, null, 2)}`);

    io.to(body.email).emit('event', body);
    res.status(201).send();
  });
}
