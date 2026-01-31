<<<<<<< HEAD
FROM node:20-alpine as builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --silent
COPY . .
RUN npm run build

FROM nginx:alpine
# Adicionar usuário não-root se necessário para conformidade, mas nginx geralmente roda como nginx ou root no container
# Para manter simples e funcional no padrão nginx:
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
=======
# Build Stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production Stage
FROM node:18-alpine
WORKDIR /app

# Install simple static server
RUN npm install -g serve

# Copy built assets
COPY --from=builder /app/dist ./dist

# Use non-root user
USER node

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
>>>>>>> main
