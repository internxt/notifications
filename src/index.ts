import 'dotenv/config';

import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';

import registerAuthSocketMiddleware from './auth-socket-middleware';

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

if (process.env.NODE_ENV === 'production') {
  const pubClient = createClient({ url: process.env.REDIS_HOST, password: process.env.REDIS_PASSWORD });
  const subClient = pubClient.duplicate();
  io.adapter(createAdapter(pubClient, subClient));
}

registerAuthSocketMiddleware(io);

const { PORT } = process.env;

httpServer.listen(PORT, () => console.log(`Running on port ${PORT}`));
