cat > Dockerfile << 'EOF'
# Build stage
FROM node:16-alpine AS build

# Set working directory
WORKDIR /app

# Set the correct API URL for React build
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

# Copy custom site config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built app
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
EOF
