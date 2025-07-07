FROM node:18-alpine

WORKDIR /app

# Copy package files from src
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source files
COPY src .

# Expose the port used by your app
EXPOSE 5000

# Start the app
CMD ["node", "app.js"]
