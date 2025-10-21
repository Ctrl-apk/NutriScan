// Simple cache for GPT responses
const cache = new Map();
const CACHE_DURATION = 3600000; // 1 hour

export const getCachedResponse = (key) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
};

export const setCachedResponse = (key, data) => {
  cache.set(key, {
    data,
    timestamp: Date.now(),
  });
};

// Clear old cache entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of cache.entries()) {
    if (now - value.timestamp > CACHE_DURATION) {
      cache.delete(key);
    }
  }
}, 300000); // Every 5 minutes