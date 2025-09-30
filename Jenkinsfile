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
                    
                    # Stop old containers
                    docker-compose -f docker-compose.prod.yml down || true
                    
                    # Remove unused images
                    docker system prune -f || true
                    
                    # Deploy new version
                    docker-compose -f docker-compose.prod.yml up -d
                    
                    echo "✅ Application deployed"
                '''
            }
        }
        
        stage('Health Check') {
            steps {
                sh '''
                    echo "🏥 Checking application health..."
                    
                    # Wait for services to start
                    sleep 30
                    
                    # Check containers
                    echo "📊 Running containers:"
                    docker ps
                    
                    # Check backend
                    echo "🔍 Testing backend API..."
                    if curl -f http://localhost:5000/api/tasks; then
                        echo "✅ Backend is working"
                    else
                        echo "❌ Backend check failed"
                        exit 1
                    fi
                    
                    # Check frontend
                    echo "🔍 Testing frontend..."
                    if curl -f http://localhost:80; then
                        echo "✅ Frontend is working"
                    else
                        echo "❌ Frontend check failed"
                        exit 1
                    fi
                    
                    echo "🎉 All services are healthy!"
                '''
            }
        }
    }
    
    post {
        always {
            echo "🧹 Cleaning up..."
        }
        success {
            sh '''
                echo "🎉 DEPLOYMENT SUCCESSFUL!"
                echo ""
                echo "🌐 Application URLs:"
                echo "   Frontend: http://$(curl -s ifconfig.me)"
                echo "   Backend API: http://$(curl -s ifconfig.me):5000"
                echo "   Swagger: http://$(curl -s ifconfig.me):5000/swagger"
            '''
        }
        failure {
            echo "❌ DEPLOYMENT FAILED"
            sh '''
                echo "Debug information:"
                docker ps -a
                docker images
            '''
        }
    }
}