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
        logger.warn(`Failed to verify a token, error: ${JSON.stringify(err, null, 2)}`);
        next(new Error());
      }
      logger.info(`Token decoded: ${decoded}`);

      if (decoded && typeof decoded !== 'string' && decoded.userId) {
        logger.info(`userId: ${decoded.userId} is listening notifications`);
        socket.join(decoded.userId);
      } else {
        const email = typeof decoded === 'string' ? decoded : decoded!.email;
        logger.info(`email: ${email} is listening notifications`);
        socket.join(email);
      }

      next();
    });
  });
}
