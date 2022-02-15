import type { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

export default function registerAuthSocketMiddleware(io: Server) {
  io.use((socket, next) => {
    const token: string = socket.handshake.auth.token;
    if (!token) next(new Error('JWT has not been included in the handshake'));

    jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
      if (err) next(new Error('Error while verifying the JWT'));
      const payload = typeof decoded === 'string' ? JSON.parse(decoded) : decoded;

      const email = typeof payload === 'string' ? payload : payload.email;

      socket.join(email);
      next();
    });
  });
}
