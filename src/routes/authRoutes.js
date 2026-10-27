import { Router } from 'express';
import { login, refresh, logout, me } from '../controllers/authController.js';
import { rateLimiter } from '../middlewares/rateLimiter.js';
import { authenticateToken } from '../middlewares/authenticate.js';

const router = Router();

// Rota com Rate Limit rígido (5 tentativas por minuto)
router.post('/login', rateLimiter(5, 60), login);

// Rotas de Ciclo de Vida do Token
router.post('/refresh', refresh);
router.post('/logout', logout);

// Rota Protegida (Demonstração)
router.get('/me', authenticateToken, me);

export default router;