import { RateLimiterRedis } from 'rate-limiter-flexible';
import redisClient from './redis';

export const forgotPasswordLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'ratelimit:forgot_password',
  points: 3, 
  duration: 15 * 60, 
});

export const resetPasswordLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'ratelimit:reset_password',
  points: 5,
  duration: 15 * 60, 
});