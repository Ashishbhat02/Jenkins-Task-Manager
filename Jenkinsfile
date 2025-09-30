pipeline {
    agent any
    
    environment {
        BACKEND_IMAGE = 'taskmanager-backend'
        FRONTEND_IMAGE = 'taskmanager-frontend'
    }
    
    stages {
        stage('Checkout Code') {
            steps {
                checkout scm
                sh '''
                    echo "📦 Repository cloned successfully"
                '''
            }
        }
        
        stage('Fix Frontend Dockerfile') {
            steps {
                sh '''
                    echo "🔧 Fixing Frontend Dockerfile permissions..."
                    cd taskmanager-frontend
                    
                    # Create a fixed Dockerfile
                    cat > Dockerfile.fixed << 'EOF'
# Build stage
FROM node:16-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# Production stage - use root user to avoid permission issues
FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built app
COPY --from=build /app/build /usr/share/nginx/html

# Fix permissions - run as root to avoid nginx permission issues
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
EOF
                    
                    # Build with fixed Dockerfile
                    docker build -t taskmanager-frontend -f Dockerfile.fixed .
                    echo "✅ Frontend Docker image built with fixed permissions"
                '''
            }
        }
        
        stage('Fix Backend Dockerfile') {
            steps {
                sh '''
                    echo "🔧 Fixing Backend Dockerfile..."
                    cd TaskManagerAPI/TaskManagerAPI
                    
                    # Create a fixed Dockerfile
                    cat > Dockerfile.fixed << 'EOF'
# Build stage
FROM mcr.microsoft.com/dotnet/sdk:5.0 AS build
WORKDIR /src
COPY ["TaskManagerAPI.csproj", "."]
RUN dotnet restore "TaskManagerAPI.csproj"
COPY . .
RUN dotnet build "TaskManagerAPI.csproj" -c Release -o /app/build

# Publish stage
FROM build AS publish
RUN dotnet publish "TaskManagerAPI.csproj" -c Release -o /app/publish

# Final stage
FROM mcr.microsoft.com/dotnet/aspnet:5.0 AS final
WORKDIR /app

# Install curl for health checks
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Create directory for SQLite database
RUN mkdir -p /app/Data && chmod 755 /app/Data

# Copy published application
COPY --from=publish /app/publish .

# Expose port
EXPOSE 80

# Simple health check that works
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \\
  CMD curl -f http://localhost:80/ || exit 1

# Entry point
ENTRYPOINT ["dotnet", "TaskManagerAPI.dll"]
EOF
                    
                    # Build with fixed Dockerfile
                    docker build -t taskmanager-backend -f Dockerfile.fixed .
                    echo "✅ Backend Docker image built with fixes"
                '''
            }
        }
        
        stage('Deploy Application') {
            steps {
                sh '''
                    echo "🚀 Deploying application..."
                    
                    # Stop and remove old containers
                    docker-compose -f docker-compose.prod.yml down || true
                    
                    # Clean up
                    docker system prune -f || true
                    
                    # Deploy
                    docker-compose -f docker-compose.prod.yml up -d
                    
                    echo "✅ Application deployed"
                '''
            }
        }
        
        stage('Wait and Test') {
            steps {
                sh '''
                    echo "⏳ Waiting for services to start..."
                    sleep 45
                    
                    echo "🔍 Testing services..."
                    
                    # Test backend
                    echo "Testing backend..."
                    if curl -f http://localhost:5000/api/tasks; then
                        echo "✅ Backend API is working!"
                    else
                        echo "❌ Backend API failed - checking logs..."
                        docker logs taskmanager-backend-prod --tail 50
                        exit 1
                    fi
                    
                    # Test frontend
                    echo "Testing frontend..."
                    if curl -f http://localhost:80; then
                        echo "✅ Frontend is working!"
                    else
                        echo "❌ Frontend failed - checking logs..."
                        docker logs taskmanager-frontend-prod --tail 50
                        exit 1
                    fi
                    
                    echo "🎉 All services are working!"
                '''
            }
        }
    }
    
    post {
        always {
            echo "🧹 Pipeline completed"
        }
        success {
            sh '''
                # Get actual EC2 public IP
                EC2_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)
                
                echo "🎉 DEPLOYMENT SUCCESSFUL!"
                echo ""
                echo "🌐 Application URLs (REAL IPs):"
                echo "   Frontend: http://$EC2_IP"
                echo "   Backend API: http://$EC2_IP:5000"
                echo "   Swagger: http://$EC2_IP:5000/swagger"
                echo ""
                echo "📊 Current containers:"
                docker ps
            '''
        }
        failure {
            sh '''
                echo "❌ DEPLOYMENT FAILED - Debug Info:"
                echo "=== CONTAINERS ==="
                docker ps -a
                echo "=== BACKEND LOGS ==="
                docker logs taskmanager-backend-prod --tail 100
                echo "=== FRONTEND LOGS ==="
                docker logs taskmanager-frontend-prod --tail 100
            '''
        }
    }
}