# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production && npm cache clean --force

# Stage 2: Runtime
FROM node:20-alpine

WORKDIR /app

# Copy dependencies
COPY --from=builder /app/node_modules ./node_modules

# Copy source code
COPY . .

# Non-root user
USER node

EXPOSE 3001

# Healthcheck interno
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001/health || exit 1

CMD ["node", "index.js"]
