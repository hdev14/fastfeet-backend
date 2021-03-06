import IORedis from 'ioredis';

class Cache {
  constructor() {
    this.redis = new IORedis({
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT
    });
  }

  set(key, value) {
    const TIME = 60 * 60 * 24;
    return this.redis.set(key, JSON.stringify(value), 'EX', TIME);
  }

  async get(key) {
    const cached = await this.redis.get(key);
    return cached ? JSON.parse(cached) : null;
  }

  invalidate(key) {
    return this.redis.del(key);
  }

  async invalidateWithPrefix(prefix) {
    const keys = await this.redis.keys(`cache:${prefix}:*`);
    const keysWithoutKeyPrefix = keys.map(k => k.replace('cache:', ''));

    return this.redis.del(keysWithoutKeyPrefix);
  }
}

export default new Cache();
