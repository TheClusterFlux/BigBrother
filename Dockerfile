# Build stage
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:1.25-alpine

# Copy built assets from the build stage
COPY --from=build /app/dist/data-cube /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 8080
EXPOSE 8080

# Start nginx and listen on port 8080
CMD ["sh", "-c", "sed -i 's/listen 80/listen 8080/g' /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
