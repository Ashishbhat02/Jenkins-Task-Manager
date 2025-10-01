# Build stage
FROM node:16-alpine AS build

# Set working directory
WORKDIR /app

# Set the correct API URL for React build - THIS IS CRITICAL
ENV REACT_APP_API_URL=http://43.205.124.152:5000

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built app
COPY --from=build /app/build /usr/share/nginx/html

# Create non-root user
RUN adduser -u 1000 -D -S -G www-data www-data && \
    chown -R www-data:www-data /var/cache/nginx && \
    chown -R www-data:www-data /var/run && \
    chown -R www-data:www-data /usr/share/nginx/html

# Switch to non-root user
USER www-data

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
