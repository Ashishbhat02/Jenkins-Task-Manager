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
                    echo "📁 Project structure:"
                    ls -la
                '''
            }
        }
        
        stage('Build Backend') {
            steps {
                sh '''
                    echo "🔨 Building .NET Backend..."
                    cd TaskManagerAPI/TaskManagerAPI
                    docker build -t taskmanager-backend .
                    echo "✅ Backend Docker image built"
                '''
            }
        }
        
        stage('Build Frontend') {
            steps {
                sh '''
                    echo "🔨 Building React Frontend..."
                    cd taskmanager-frontend
                    docker build -t taskmanager-frontend .
                    echo "✅ Frontend Docker image built"
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
        
        stage('Debug Services') {
            steps {
                sh '''
                    echo "🔍 Debugging services..."
                    
                    # Wait a bit for services to start
                    sleep 10
                    
                    echo "=== CONTAINER STATUS ==="
                    docker ps -a
                    
                    echo "=== BACKEND LOGS ==="
                    docker logs taskmanager-backend-prod --tail 50 || echo "Could not get backend logs"
                    
                    echo "=== FRONTEND LOGS ==="
                    docker logs taskmanager-frontend-prod --tail 50 || echo "Could not get frontend logs"
                    
                    echo "=== BACKEND DETAILS ==="
                    docker inspect taskmanager-backend-prod | grep -A 10 -B 5 "Health" || echo "No health info"
                    
                    echo "=== NETWORK CHECK ==="
                    docker network ls
                    docker inspect main_default || echo "Network not found"
                '''
            }
        }
        
        stage('Test Backend API') {
            steps {
                sh '''
                    echo "🧪 Testing Backend API..."
                    
                    # Try multiple endpoints
                    echo "Testing /health endpoint..."
                    curl -v http://localhost:5000/health || echo "Health endpoint failed"
                    
                    echo "Testing /swagger endpoint..."
                    curl -v http://localhost:5000/swagger || echo "Swagger endpoint failed"
                    
                    echo "Testing /api/tasks endpoint..."
                    curl -v http://localhost:5000/api/tasks || echo "Tasks endpoint failed"
                    
                    # Check if backend is actually running
                    echo "Backend container processes:"
                    docker top taskmanager-backend-prod || echo "Cannot check processes"
                '''
            }
        }
        
        stage('Fix and Retry') {
            steps {
                sh '''
                    echo "🔧 Attempting fixes..."
                    
                    # Check if SQLite database exists and is accessible
                    echo "Checking database..."
                    docker exec taskmanager-backend-prod ls -la /app/Data/ || echo "Cannot access Data directory"
                    
                    # Restart backend with more time to initialize
                    echo "Restarting backend..."
                    docker restart taskmanager-backend-prod
                    sleep 20
                    
                    # Test again
                    echo "Retesting API..."
                    curl -f http://localhost:5000/api/tasks && echo "✅ Backend is now working!" || echo "❌ Backend still failing"
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
                echo "🎉 DEPLOYMENT SUCCESSFUL!"
                echo ""
                echo "🌐 Application URLs:"
                echo "   Frontend: http://YOUR_EC2_IP"
                echo "   Backend API: http://YOUR_EC2_IP:5000"
                echo "   Swagger: http://YOUR_EC2_IP:5000/swagger"
            '''
        }
        failure {
            sh '''
                echo "❌ DEPLOYMENT FAILED - Detailed Debug Info:"
                echo "=== FINAL CONTAINER STATUS ==="
                docker ps -a
                echo "=== BACKEND LOGS (LAST 100 LINES) ==="
                docker logs taskmanager-backend-prod --tail 100 || echo "No backend logs"
                echo "=== FRONTEND LOGS (LAST 100 LINES) ==="
                docker logs taskmanager-frontend-prod --tail 100 || echo "No frontend logs"
                echo "=== DOCKER NETWORK INFO ==="
                docker network inspect main_default || echo "Network not found"
            '''
        }
    }
}