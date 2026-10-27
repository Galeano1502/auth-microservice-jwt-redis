import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  }
});

redis.on('connect', () => {
  console.log(' Conectado ao Redis com sucesso.');
});

redis.on('error', (err) => {
  console.error(' Erro de conexão com o Redis:', err.message);
});

export default redis;