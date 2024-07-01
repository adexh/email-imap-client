import { createClient } from 'redis';
// 1 configure our redis
export const redisClient = createClient({
    password:process.env.REDIS_PASSWORD,
    url:'redis://localhost:6379'
}); 