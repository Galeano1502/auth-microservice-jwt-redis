import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import redis from '../config/redis.js';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'access_secret_fallback';
const REFRESH_EXPIRATION_SECONDS = 7 * 24 * 60 * 60; // 7 dias

export const generateTokens = async (userId, userRole = 'user') => {
  // 1. Access Token (Stateless - 15 min)
  const accessToken = jwt.sign(
    { sub: userId, role: userRole },
    ACCESS_SECRET,
    { expiresIn: '15m' }
  );

  // 2. Refresh Token opaco único
  const refreshToken = crypto.randomBytes(40).toString('hex');

  // Salva a associação no Redis
  const tokenKey = `refresh_token:${userId}:${refreshToken}`;
  await redis.set(tokenKey, 'active', 'EX', REFRESH_EXPIRATION_SECONDS);

  return { accessToken, refreshToken };
};

export const revokeRefreshToken = async (userId, refreshToken) => {
  const tokenKey = `refresh_token:${userId}:${refreshToken}`;
  await redis.del(tokenKey);
};

export const isRefreshTokenValid = async (userId, refreshToken) => {
  const tokenKey = `refresh_token:${userId}:${refreshToken}`;
  const status = await redis.get(tokenKey);
  return status === 'active';
};

export const addTokenToBlacklist = async (accessToken) => {
  const decoded = jwt.decode(accessToken);
  if (decoded && decoded.exp) {
    const ttl = decoded.exp - Math.floor(Date.now() / 1000);
    if (ttl > 0) {
      await redis.set(`blacklist:${accessToken}`, 'true', 'EX', ttl);
    }
  }
};