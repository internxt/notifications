import 'dotenv/config';
import httpServer from './http-server';
import Logger from './logger';

const { PORT } = process.env;

const logger = Logger.getInstance();

httpServer.listen(PORT, () => logger.info(`Running on port ${PORT}`));
