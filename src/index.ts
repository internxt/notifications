import 'dotenv/config';
import httpServer from './http-server';

const { PORT } = process.env;

httpServer.listen(PORT, () => console.log(`Running on port ${PORT}`));
