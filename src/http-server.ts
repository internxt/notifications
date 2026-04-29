import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';

import registerAuthSocketMiddleware from './auth-socket-middleware';
import registerAuthApiMiddleware from './auth-api-middleware';
import registerHandler from './handler';
import Logger from './logger';

function getAllowedOrigins(): string[] | RegExp[] | boolean | (string | RegExp)[] {
  const log = Logger.getInstance();
  const originsEnv = process.env.ALLOWED_ORIGINS;

  if (!originsEnv) {
    log.warn('ALLOWED_ORIGINS environment variable is not set, using default CORS configuration');
    return true;
  }

  try {
    const originsString = Buffer.from(originsEnv, 'base64').toString('utf8');
    const allowedOrigins: string[] = JSON.parse(originsString);
    return allowedOrigins.map((origin) => {
      if (origin.startsWith('^') && origin.endsWith('$')) {
        return new RegExp(origin);
      }
      return origin;
    });
  } catch (error) {
    log.error('Using default CORS configuration. Failed to parse ALLOWED_ORIGINS:', error);
    return true;
  }
}

export default async function () {
  const app = express();
  const corsOptions = { credentials: true, origin: getAllowedOrigins() };
  app.use(cors(corsOptions));
  app.use(express.json());
  const httpServer = createServer(app);

  const io = new Server(httpServer, {
    cors: corsOptions,
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
