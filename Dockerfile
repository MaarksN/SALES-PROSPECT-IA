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
