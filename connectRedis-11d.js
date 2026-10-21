import { Redis } from 'ioredis';

const redis = new Redis();

redis.set('redisKey', 'keyForTest', 'EX', 10);

setTimeout(async () => {
  const ttl = await redis.ttl('redisKey');
  console.log(ttl);
  redis.del('redisKey');
  console.log('key deleted');
}, 5000);
