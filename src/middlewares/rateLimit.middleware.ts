import rateLimit from 'express-rate-limit';
import RedisStore, { RedisReply } from 'rate-limit-redis';
import redisClient from '../config/redis';

export const apiRateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
		sendCommand: (command: string, ...args: string[]) =>
			redisClient.call(command, ...args) as Promise<any | RedisReply>,
	}),
  message: 'Too many requests, please try again later.',
});
