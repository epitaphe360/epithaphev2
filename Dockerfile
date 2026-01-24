# Epitaphe - Production Dockerfile
# Single service: Node.js backend + static frontend serving

FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first (better Docker caching)
COPY package*.json ./

# Install ALL dependencies (including devDependencies for build)
RUN npm ci

# Copy ALL source code needed for build
COPY tsconfig.json ./
COPY tsconfig.build.json ./
COPY vite.config.ts ./
COPY tailwind.config.ts ./
COPY postcss.config.js ./
COPY drizzle.config.ts ./

# Copy source directories
COPY client ./client
COPY cms-dashboard ./cms-dashboard
COPY server ./server
COPY shared ./shared
COPY script ./script

# Build the application (creates dist/index.cjs + dist/public/)
RUN npm run build

# ============================================
# Production stage - minimal image
# ============================================
FROM node:20-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

# Copy package files
COPY package*.json ./

# Install ONLY production dependencies
RUN npm ci --omit=dev && npm cache clean --force

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Copy migrations if needed
COPY migrations ./migrations

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Create uploads directory
RUN mkdir -p /app/uploads && chown -R nodejs:nodejs /app/uploads

# Switch to non-root user
USER nodejs

# Railway injects PORT dynamically, no default needed
# EXPOSE is documentation only, Railway uses $PORT

# Remove Docker healthcheck - Railway handles this via /api/health
# HEALTHCHECK removed to avoid conflicts with Railway's healthcheck

# Start command
CMD ["node", "dist/index.cjs"]
