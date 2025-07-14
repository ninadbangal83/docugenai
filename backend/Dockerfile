# Stage 1: Build Stage
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Install required build tools (optional for some native deps)
RUN apk add --no-cache libc6-compat

# Copy package files and install dependencies including devDependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy the entire source code
COPY . .

# Compile TypeScript (reliable method using npx)
RUN npx tsc

# Remove devDependencies to reduce image size
RUN npm prune --production

# Stage 2: Runtime Stage
FROM node:18-alpine AS runtime

# Set working directory
WORKDIR /app

# Copy production dependencies and built code from builder
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Copy any additional folders if needed (e.g., config, models, assets)
# COPY --from=builder /app/models ./models

# Expose port (if needed)
EXPOSE 4000

# Run the application
CMD ["node", "dist/index.js"]
