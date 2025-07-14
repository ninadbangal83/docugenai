# -------- Build Stage --------
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
COPY craco.config.js ./
COPY eslint.config.mjs ./
COPY .prettierrc ./
COPY .prettierignore ./
COPY public ./public
COPY src ./src

RUN npm install
RUN npx tsc --noEmit
RUN npm run build

# -------- Production Stage --------
FROM nginx:stable-alpine

# Copy built React app
COPY --from=build /app/build /usr/share/nginx/html

# 🔧 Add custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Run Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
