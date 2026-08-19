FROM node:18-alpine

WORKDIR /app

# Copy package files first (for layer caching)
COPY package.json package-lock.json ./

# Install all dependencies (dev included — needed for vite build)
RUN npm install --legacy-peer-deps

# Copy source files AFTER install so node_modules is intact
COPY . .

# Build the Vite frontend
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
