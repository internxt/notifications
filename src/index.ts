import 'dotenv/config';
import Logger from './logger';
import getHttpServer from './http-server';

const { PORT } = process.env;

const logger = Logger.getInstance();

getHttpServer().then(({ httpServer }) => {
  httpServer.listen(PORT, () => logger.info(`Running on port ${PORT}`));
});
