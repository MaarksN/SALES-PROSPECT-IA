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
