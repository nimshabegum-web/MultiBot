FROM node:20-alpine
WORKDIR /app

# Install deps
COPY package*.json ./
RUN npm ci

# Configure API base for build-time (browser must reach host backend)
ENV VITE_API_BASE=http://localhost:8003

# Copy source and build static assets
COPY . .
RUN npm run build

# Expose and serve built app using Vite preview
EXPOSE 5173
CMD ["npm","run","preview","--","--host","0.0.0.0","--port","5173"]
