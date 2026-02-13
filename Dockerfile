FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY admin/package*.json ./admin/
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

# Install dependencies
RUN npm install

# Copy everything
COPY . .

# Build frontend and admin
RUN npm run build:all

# Default port (can be overridden)
EXPOSE 4444 3000 6001

# Command is set in docker-compose.yaml
CMD ["npm", "start"]
