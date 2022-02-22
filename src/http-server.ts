import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';

import registerAuthSocketMiddleware from './auth-socket-middleware';
import registerAuthApiMiddleware from './auth-api-middleware';
import registerHandler from './handler';
import Logger from './logger';

export const app = express();
app.use(express.json());
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

const logger = Logger.getInstance();

if (process.env.NODE_ENV === 'production') {
  logger.info('Service is running in production, the redis adapter is going to be used');

  const pubClient = createClient({ url: process.env.REDIS_HOST, password: process.env.REDIS_PASSWORD });
  const subClient = pubClient.duplicate();
  io.adapter(createAdapter(pubClient, subClient));
}

registerAuthSocketMiddleware(io);
registerAuthApiMiddleware(app);

registerHandler(app, io);

export default httpServer;
