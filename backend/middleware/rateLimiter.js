const requestCounts = new Map();

export const rateLimiter = (maxRequests = 100, windowMs = 60000) => {
  return (req, res, next) => {
    const key = req.user?._id || req.ip;
    const now = Date.now();
    
    if (!requestCounts.has(key)) {
      requestCounts.set(key, []);
    }

    const requests = requestCounts.get(key);
    const recentRequests = requests.filter(time => now - time < windowMs);
    
    if (recentRequests.length >= maxRequests) {
      return res.status(429).json({
        message: 'Too many requests. Please try again later.',
        retryAfter: Math.ceil((requests[0] + windowMs - now) / 1000),
      });
    }

    recentRequests.push(now);
    requestCounts.set(key, recentRequests);
    next();
  };
};

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, requests] of requestCounts.entries()) {
    const recent = requests.filter(time => now - time < 300000);
    if (recent.length === 0) {
      requestCounts.delete(key);
    } else {
      requestCounts.set(key, recent);
    }
  }
}, 300000);