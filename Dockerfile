# Multi-stage Dockerfile for E-commerce Application
# Stage 1: Build Frontend
FROM node:18-alpine AS frontend-builder

WORKDIR /app/client

# Copy package files
COPY client/package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY client/ ./

# Build static export
RUN npm run build

# Stage 2: Build Backend
FROM node:18-alpine AS backend-builder

WORKDIR /app/server

# Copy package files
COPY server/package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY server/ ./

# Build backend
RUN npm run build

# Stage 3: Production
FROM node:18-alpine AS production

WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

# Copy built backend
COPY --from=backend-builder --chown=nestjs:nodejs /app/server/dist ./server/dist
COPY --from=backend-builder --chown=nestjs:nodejs /app/server/node_modules ./server/node_modules
COPY --from=backend-builder --chown=nestjs:nodejs /app/server/package*.json ./server/

# Copy built frontend
COPY --from=frontend-builder --chown=nestjs:nodejs /app/client/out ./client/out

# Copy Prisma schema and migrations
COPY --chown=nestjs:nodejs server/prisma ./server/prisma

# Set environment
ENV NODE_ENV=production
ENV PORT=3000

# Switch to non-root user
USER nestjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/v1/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start application
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server/dist/main.js"]
