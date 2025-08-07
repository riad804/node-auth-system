import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { sequelize } from './models';
import logger from './utils/logger';
import { connectRedis, disconnectRedis } from './config/redis';

const PORT = process.env.SERVER_PORT || 3000;

(async () => {
  try {
    await sequelize.sync();
    await connectRedis();
    logger.info('Database and Redis connected successfully.');
    logger.info('Database connected.');
    app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
  } catch (err) {
    logger.error('Failed to start server: ' + err);
  }
})();

process.on('SIGINT', async () => {
  logger.info('Gracefully shutting down...');
  await disconnectRedis();
  process.exit(0);
});