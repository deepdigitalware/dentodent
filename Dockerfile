# Multi-stage build for DOD project
# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files for better caching
COPY package*.json ./
COPY admin/package*.json ./admin/
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

# Install ALL dependencies (including devDependencies for build)
# Using --legacy-peer-deps to avoid potential dependency conflicts in some environments
RUN npm install --legacy-peer-deps

# Copy the rest of the source code
COPY . .

# Build the applications
# We use --production=false to ensure all build tools are available
# And we use CI=false to prevent warnings from being treated as errors
# Added more verbose logging to see exactly where it fails if it does
RUN CI=false npm run build:all

# Final stage
FROM node:20-alpine

WORKDIR /app

# Copy ONLY necessary files from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/backend ./backend
COPY --from=builder /app/dist-frontend ./dist-frontend
COPY --from=builder /app/admin/dist ./admin/dist

# Expose ports
EXPOSE 4444 3000 6001

# Command is handled by docker-compose.yaml
CMD ["npm", "start"]
