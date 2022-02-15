import type { Express } from 'express';
import type { Server } from 'socket.io';

type RequestBody = {
  event: string;
  payload: any;
  email: string;
  clientId: string;
};

function validateBody(body: Record<string, any>): RequestBody {
  if (body.event && body.payload && body.email && body.clientId) return body as RequestBody;
  throw new Error('Body is not in the expected format');
}

export default function registerHandler(app: Express, io: Server) {
  app.post('/', (req, res) => {
    let body: RequestBody;
    try {
      body = validateBody(req.body);
    } catch (err) {
      console.log('Validation failed', (err as Error).message);
      return res.status(400).send();
    }

    io.to(body.email).emit('event', body);
    res.status(201).send();
  });
}
