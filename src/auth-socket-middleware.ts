import type { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import Logger from './logger';

export default function registerAuthSocketMiddleware(io: Server) {
  io.use((socket, next) => {
    const logger = Logger.getInstance();

    const token: string = socket.handshake.auth.token;
    if (!token) {
      logger.warn('A socket connection was tried but lacked the token');
      next(new Error());
    }

    jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
      if (err) {
        logger.warn(`Failed to verify a token, error: ${JSON.stringify(err, null, 2)}, token: ${JSON.stringify(decoded)}`);
        next(err);
      }
      logger.info(`Token decoded: ${JSON.stringify(decoded, null, 2)}`);

      if (
        decoded && 
        typeof decoded !== 'string' && 
        decoded.payload && 
        decoded.payload.uuid
      ) {
        const uuid = decoded.payload.uuid;
        logger.info(`user: ${uuid} is listening notifications`);
        socket.join(uuid);
      } else {
        const email = typeof decoded === 'string' ? decoded : decoded!.email;
        logger.info(`email: ${email} is listening notifications`);
        socket.join(email);
      }

      next();
    });
  });
}
