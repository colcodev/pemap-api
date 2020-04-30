import redis from 'redis';

export const redisClient = redis.createClient({ url: process.env.REDIS_URI });
export const closeRedisClient = () => redisClient.quit();

export default { redisClient, closeRedisClient };
