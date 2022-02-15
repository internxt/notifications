import 'dotenv/config';

import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer);

if (process.env.NODE_ENV === 'production') {
  const pubClient = createClient({ url: process.env.REDIS_HOST, password: process.env.REDIS_PASSWORD });
  const subClient = pubClient.duplicate();
  io.adapter(createAdapter(pubClient, subClient));
}

const { PORT } = process.env;

httpServer.listen(PORT, () => console.log(`Running on port ${PORT}`));
