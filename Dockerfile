# Multi-stage Dockerfile for E-commerce Application
# Stage 1: Build Frontend
FROM node:18-alpine AS frontend-builder

WORKDIR /app/client

# Copy package files
COPY client/package*.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci

# Copy source code
COPY client/ ./

# Set environment for production build
ENV NODE_ENV=production

# Build static export
RUN echo "Building frontend..." && npm run build && echo "Frontend build completed successfully"

# Stage 2: Build Backend
FROM node:18-alpine AS backend-builder

WORKDIR /app/server

# Copy package files
COPY server/package*.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci

# Copy source code
COPY server/ ./

# Set environment for production build
ENV NODE_ENV=production

# Generate Prisma client
RUN npx prisma generate

# Build backend
RUN echo "Building backend..." && npm run build && echo "Backend build completed successfully"

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
COPY --from=backend-builder --chown=nestjs:nodejs /app/server/package*.json ./server/

# Copy Prisma schema and migrations first
COPY --chown=nestjs:nodejs server/prisma ./server/prisma

# Verify Prisma schema is copied correctly
RUN echo "Verifying Prisma schema copy..." && ls -la prisma/ && cat prisma/schema.prisma | head -10

# Install only production dependencies
WORKDIR /app/server
RUN npm ci --only=production

# Generate Prisma client for production
RUN echo "Checking Prisma schema location..." && ls -la prisma/ && npx prisma generate

WORKDIR /app

# Copy built frontend
COPY --from=frontend-builder --chown=nestjs:nodejs /app/client/out ./client/out

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
