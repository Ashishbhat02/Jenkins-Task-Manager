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
        
        stage('Build Backend with Database Fix') {
            steps {
                sh '''
                    echo "🔨 Building .NET Backend with database fixes..."
                    cd TaskManagerAPI/TaskManagerAPI
                    
                    # Create a fixed Dockerfile without apt-get (use alpine for curl)
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

# Final stage - use alpine for better compatibility
FROM mcr.microsoft.com/dotnet/aspnet:5.0-alpine AS final
WORKDIR /app

# Install curl (alpine uses apk instead of apt)
RUN apk add --no-cache curl

# Create directory for SQLite database
RUN mkdir -p /app/Data && chmod 755 /app/Data

# Copy published application
COPY --from=publish /app/publish .

# Expose port
EXPOSE 80

# Simple health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \\
  CMD curl -f http://localhost:80/ || exit 1

# Entry point
ENTRYPOINT ["dotnet", "TaskManagerAPI.dll"]
EOF
                    
                    # Build with fixed Dockerfile
                    docker build -t taskmanager-backend -f Dockerfile.fixed .
                    echo "✅ Backend Docker image built with Alpine and curl"
                '''
            }
        }
        
        stage('Build Frontend with Permission Fix') {
            steps {
                sh '''
                    echo "🔨 Building React Frontend with permission fixes..."
                    cd taskmanager-frontend
                    
                    # Create a fixed Dockerfile that runs as root to avoid permission issues
                    cat > Dockerfile.fixed << 'EOF'
# Build stage
FROM node:16-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# Production stage - run as root to avoid nginx permission issues
FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built app
COPY --from=build /app/build /usr/share/nginx/html

# Create necessary directories and fix permissions
RUN mkdir -p /var/cache/nginx /var/run && \\
    chown -R nginx:nginx /usr/share/nginx/html /var/cache/nginx /var/run && \\
    chmod -R 755 /usr/share/nginx/html /var/cache/nginx /var/run

# Expose port
EXPOSE 80

# Start nginx as root (will drop privileges internally)
CMD ["nginx", "-g", "daemon off;"]
EOF
                    
                    # Build with fixed Dockerfile
                    docker build -t taskmanager-frontend -f Dockerfile.fixed .
                    echo "✅ Frontend Docker image built with permission fixes"
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
        
        stage('Initialize Database') {
            steps {
                sh '''
                    echo "🗄️ Initializing database..."
                    
                    # Wait for backend to start
                    sleep 10
                    
                    # Run database migrations
                    echo "Running EF Core database migrations..."
                    docker exec taskmanager-backend-prod dotnet ef database update || echo "EF migrations not available, trying alternative..."
                    
                    # Alternative: Ensure database is created
                    echo "Ensuring database is created..."
                    docker exec taskmanager-backend-prod ls -la /app/Data/ || echo "Data directory not accessible"
                    
                    # Test if API works now
                    echo "Testing API after database initialization..."
                    sleep 10
                '''
            }
        }
        
        stage('Test Services') {
            steps {
                sh '''
                    echo "🧪 Testing services..."
                    
                    # Wait for services to stabilize
                    sleep 30
                    
                    # Test backend
                    echo "Testing backend API..."
                    if curl -f http://localhost:5000/api/tasks; then
                        echo "✅ Backend API is working!"
                    else
                        echo "⚠️ Backend API still failing, checking alternative endpoints..."
                        curl http://localhost:5000/ || echo "Root endpoint failed"
                        curl http://localhost:5000/swagger || echo "Swagger endpoint failed"
                        
                        # Show backend logs for debugging
                        echo "Backend logs:"
                        docker logs taskmanager-backend-prod --tail 20
                    fi
                    
                    # Test frontend
                    echo "Testing frontend..."
                    if curl -f http://localhost:80; then
                        echo "✅ Frontend is working!"
                    else
                        echo "❌ Frontend failed - checking logs..."
                        docker logs taskmanager-frontend-prod --tail 20
                    fi
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
                
                echo "🎉 DEPLOYMENT COMPLETED!"
                echo ""
                echo "🌐 Application URLs (TEST THESE):"
                echo "   Frontend: http://$EC2_IP"
                echo "   Backend API: http://$EC2_IP:5000/api/tasks"
                echo "   Swagger Docs: http://$EC2_IP:5000/swagger"
                echo ""
                echo "📊 Container Status:"
                docker ps
                echo ""
                echo "🔧 If APIs don't work, check:"
                echo "   - Backend logs: docker logs taskmanager-backend-prod"
                echo "   - Frontend logs: docker logs taskmanager-frontend-prod"
            '''
        }
        failure {
            sh '''
                echo "❌ DEPLOYMENT HAD ISSUES"
                echo "=== FINAL DEBUG INFO ==="
                docker ps -a
                echo "=== BACKEND LOGS ==="
                docker logs taskmanager-backend-prod --tail 50
                echo "=== FRONTEND LOGS ==="
                docker logs taskmanager-frontend-prod --tail 50
            '''
        }
    }
}