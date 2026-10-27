import {
  generateTokens,
  revokeRefreshToken,
  isRefreshTokenValid,
  addTokenToBlacklist
} from '../services/authService.js';

export const login = async (req, res) => {
  const { email, password } = req.body;

  // Exemplo Mock: Substitua pela chamada real ao seu banco (Postgres/Mongo)
  if (email !== 'user@exemplo.com' || password !== '123456') {
    return res.status(401).json({ error: 'Credenciais inválidas.' });
  }

  const userId = 'usr_998877';
  const userRole = 'admin';

  const tokens = await generateTokens(userId, userRole);
  return res.json(tokens);
};

export const refresh = async (req, res) => {
  const { userId, refreshToken } = req.body;

  if (!userId || !refreshToken) {
    return res.status(400).json({ error: 'userId e refreshToken são obrigatórios.' });
  }

  const isValid = await isRefreshTokenValid(userId, refreshToken);
  if (!isValid) {
    return res.status(403).json({ error: 'Refresh Token inválido ou revogado.' });
  }

  // Rotaciona o token: Invalida o antigo e gera um novo par
  await revokeRefreshToken(userId, refreshToken);
  const newTokens = await generateTokens(userId, 'admin');

  return res.json(newTokens);
};

export const logout = async (req, res) => {
  const { userId, refreshToken } = req.body;
  const authHeader = req.headers['authorization'];
  const accessToken = authHeader && authHeader.split(' ')[1];

  if (userId && refreshToken) {
    await revokeRefreshToken(userId, refreshToken);
  }

  if (accessToken) {
    await addTokenToBlacklist(accessToken);
  }

  return res.json({ message: 'Sessão encerrada com sucesso.' });
};

export const me = async (req, res) => {
  return res.json({
    message: 'Acesso autorizado à rota protegida.',
    user: req.user
  });
};