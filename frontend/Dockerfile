# Build stage
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install --save-dev @types/react @types/react-dom @types/node


COPY . .
RUN npm run build

# Production stage (serving with nginx)
FROM nginx:stable-alpine

# Copy built React files from build stage to nginx public folder
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom nginx config (optional)
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
