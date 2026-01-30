FROM node:20-alpine

WORKDIR /app

# Instala dependências do server
COPY server/package*.json ./
RUN npm ci --production

# Copia código fonte do server
COPY server/ .
# Copia arquivo .env da raiz para o contexto do server (opcional, melhor usar ENV vars do docker)
COPY .env ../.env

EXPOSE 3001

CMD ["node", "index.js"]
