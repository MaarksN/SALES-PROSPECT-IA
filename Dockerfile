# Node.js 18 Base Image
FROM node:18-alpine

# Working Directory
WORKDIR /app

# Install Dependencies
COPY package*.json ./
RUN npm install --production

# Copy Source
COPY . .

# Build (if needed)
# RUN npm run build

# Expose Port
EXPOSE 3000

# Start Command
CMD ["node", "server/index.js"]
