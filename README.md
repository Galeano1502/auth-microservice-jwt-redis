# 🛡️ Microserviço de Autenticação JWT + Redis

Microserviço de alta performance focado em gestão de identidade, sessão *stateless* com JWT, renovação segura via Refresh Tokens e controle de acessos em memória com Redis.

---

## 🚀 Tecnologias

- **Node.js** (ES Modules)
- **Express.js**
- **JSON Web Token (JWT)**
- **Redis** & **ioRedis**
- **Docker** & **Docker Compose**

---

## 🛡️ Funcionalidades e Segurança

- **Access Token (15 min) + Refresh Token (7 dias)**: Ciclo de vida estendido e seguro.
- **Rotação de Refresh Token**: Invalidação do token antigo a cada renovação para prevenção de reuso malicioso.
- **Blacklist em Memória via Redis**: Revogação instantânea de tokens de acesso no logout antes da expiração natural.
- **Rate Limiting**: Proteção contra ataques de força bruta no endpoint de login baseada em IP via Redis.

---

## 📂 Estrutura do Projeto

```text
auth-microservice/
├── src/
│   ├── config/          # Conexão e tratamento do Redis
│   ├── controllers/     # Regras das rotas de autenticação
│   ├── middlewares/     # Middleware JWT + Blacklist e Rate Limiter
│   ├── services/        # Lógica de emissão e manipulação de tokens
│   ├── routes/          # Definição dos endpoints da API
│   └── app.js           # Inicialização do Express
├── docker-compose.yml   # Orquestração do app + Redis
├── Dockerfile           # Imagem Node.js da aplicação
└── package.json