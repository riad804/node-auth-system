import e from "express";
import RedisClient from "ioredis";
import logger from "../utils/logger";

let redis: RedisClient | null = null;

export const redisclient = new RedisClient({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  password: process.env.REDIS_PASSWORD || '',
  db: parseInt(process.env.REDIS_DB || '0', 10),
  lazyConnect: true,
});

export const connectRedis = async () => {
    if (redisclient && (redisclient.status === 'connecting' || redisclient.status === 'ready')) {
        // Already connecting or connected, do nothing
        return;
    }
  try {
    await redisclient.connect();
    console.log('Redis connected successfully');
  } catch (error) {
    logger.error('Failed to connect to Redis:', error);
    console.error('Failed to connect to Redis:', error);
  }
};

export const disconnectRedis = async () => {
  try {
    await redisclient.quit();
    console.log('Redis disconnected successfully');
  } catch (error) {
    logger.error('Failed to connect to Redis:', error);
    console.error('Failed to disconnect from Redis:', error);
  }
};

export const redisMiddleware = (req: e.Request, res: e.Response, next: e.NextFunction) => {
  if (!redisclient.status || redisclient.status !== 'ready') {
    return res.status(503).json({ message: 'Redis service is unavailable' });
  }
  next();
};

export default redisclient;