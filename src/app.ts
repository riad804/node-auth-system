import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import routes from './routes';
import { errorHandler } from './middlewares/error.middleware';
import logger from './utils/logger';
import { apiRateLimiter } from './middlewares/rateLimit.middleware';
import { redisMiddleware } from './config/redis';

const app = express();

app.use(cors());
app.use(helmet());
app.use(logger.log);
app.use(express.json());

app.use(redisMiddleware);
app.use(apiRateLimiter);

app.use('/api', routes);
app.use(errorHandler);

export default app;