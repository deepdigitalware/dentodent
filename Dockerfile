# Multi-stage build for DOD project
# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files for root and sub-projects
COPY package*.json ./
COPY admin/package*.json ./admin/
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

# Install dependencies for root
RUN npm install --legacy-peer-deps

# Install dependencies for admin
WORKDIR /app/admin
RUN npm install --legacy-peer-deps

# Install dependencies for frontend
WORKDIR /app/frontend
RUN npm install --legacy-peer-deps

# Go back to root and copy the rest of the source code
WORKDIR /app
COPY . .

# Build the applications
# We use CI=false to prevent warnings from being treated as errors
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
