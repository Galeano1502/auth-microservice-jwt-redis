import redis from '../config/redis.js';

export const rateLimiter = (limit = 5, windowInSeconds = 60) => {
  return async (req, res, next) => {
    const key = `rate-limit:${req.ip}:${req.path}`;

    try {
      const requests = await redis.incr(key);

      if (requests === 1) {
        await redis.expire(key, windowInSeconds);
      }

      if (requests > limit) {
        const ttl = await redis.ttl(key);
        return res.status(429).json({
          error: 'Muitas requisições. Tente novamente mais tarde.',
          retryAfterSeconds: ttl
        });
      }

      next();
    } catch (err) {
      console.error('Erro no Rate Limiter (Fail-Open):', err);
      next(); // Continua para evitar indisponibilidade em falha do Redis
    }
  };
};