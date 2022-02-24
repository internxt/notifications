import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';

import registerAuthSocketMiddleware from './auth-socket-middleware';
import registerAuthApiMiddleware from './auth-api-middleware';
import registerHandler from './handler';
import Logger from './logger';

export default async function () {
  const app = express();
  app.use(express.json());
  const httpServer = createServer(app);

  const io = new Server(httpServer, {
    cors: {
      origin: '*',
      credentials: true,
    },
  });

  const logger = Logger.getInstance();

  if (process.env.NODE_ENV === 'production') {
    logger.info('Service is running in production, the redis adapter is going to be used');

    const pubClient = createClient({ url: process.env.REDIS_URL });
    const subClient = pubClient.duplicate();
    await Promise.all([pubClient.connect(), subClient.connect()]);
    io.adapter(createAdapter(pubClient, subClient));
  }

  registerAuthSocketMiddleware(io);
  registerAuthApiMiddleware(app);

  registerHandler(app, io);

  return { httpServer, app };
}
