# Build Stage
FROM node:22-alpine as builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code and build
COPY . .
RUN ls -la
# Note: Vite requires environment variables at build time if they are utilized in the code
# Easypanel usually injects them, but for strict build-time usage, ensure they are set in the Easypanel Environment tab.
RUN npm run build

# Production Stage
FROM node:22-alpine

# Set production environment
ENV NODE_ENV=production

WORKDIR /app

# Copy built assets and server script
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/server.js ./

# Install only production dependencies
RUN npm ci --only=production

# Expose port (Easypanel defaults to 3000 usually, but we expose explicitly)
EXPOSE 3000

# Start server
CMD ["node", "server.js"]
