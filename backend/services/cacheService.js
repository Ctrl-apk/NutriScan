import NodeCache from 'node-cache';

class CacheService {
  constructor() {
    // TTL: 1 hour, check period: 10 minutes
    this.cache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });
    this.stats = { hits: 0, misses: 0 };
  }

  generateKey(prefix, ...params) {
    return `${prefix}:${params.map(p => String(p).toLowerCase()).join(':')}`;
  }

  get(key) {
    const value = this.cache.get(key);
    if (value) {
      this.stats.hits++;
      console.log(`Cache HIT: ${key}`);
    } else {
      this.stats.misses++;
      console.log(`Cache MISS: ${key}`);
    }
    return value;
  }

  set(key, value, ttl) {
    return this.cache.set(key, value, ttl);
  }

  delete(key) {
    return this.cache.del(key);
  }

  flush() {
    return this.cache.flushAll();
  }

  getStats() {
    const cacheStats = this.cache.getStats();
    return {
      ...this.stats,
      keys: cacheStats.keys,
      hitRate: this.stats.hits / (this.stats.hits + this.stats.misses) || 0,
    };
  }
}

export default new CacheService();