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
                    echo "📁 Current directory structure:"
                    ls -la
                    echo "📁 Backend folder contents:"
                    ls -la TaskManagerAPI/TaskManagerAPI/ || echo "Backend folder not found"
                    echo "📁 Frontend folder contents:"
                    ls -la taskmanager-frontend/ || echo "Frontend folder not found"
                '''
            }
        }
        
        stage('Build Backend with Docker') {
            steps {
                script {
                    echo "🔨 Building .NET Backend with Docker..."
                    dir('TaskManagerAPI/TaskManagerAPI') {
                        // Use Docker container with .NET pre-installed
                        docker.image('mcr.microsoft.com/dotnet/sdk:5.0').inside {
                            sh '''
                                dotnet restore
                                dotnet build --configuration Release
                                echo "✅ Backend build completed"
                            '''
                        }
                    }
                }
            }
        }
        
        stage('Build Frontend with Docker') {
            steps {
                script {
                    echo "🔨 Building React Frontend with Docker..."
                    dir('taskmanager-frontend') {
                        // Use Docker container with Node.js pre-installed
                        docker.image('node:16-alpine').inside {
                            sh '''
                                npm install
                                npm run build
                                echo "✅ Frontend build completed"
                            '''
                        }
                    }
                }
            }
        }
        
        stage('Build Docker Images') {
            steps {
                script {
                    echo "🐳 Building Docker images..."
                    
                    // Build backend Docker image
                    dir('TaskManagerAPI/TaskManagerAPI') {
                        docker.build("${BACKEND_IMAGE}:latest")
                    }
                    
                    // Build frontend Docker image  
                    dir('taskmanager-frontend') {
                        docker.build("${FRONTEND_IMAGE}:latest")
                    }
                    
                    echo "✅ Docker images built successfully"
                }
            }
        }
        
        stage('Deploy Application') {
            steps {
                script {
                    echo "🚀 Deploying application..."
                    
                    // Stop and remove old containers
                    sh 'docker-compose -f docker-compose.prod.yml down || true'
                    
                    // Remove old images to save space
                    sh 'docker system prune -f || true'
                    
                    // Deploy new version
                    sh 'docker-compose -f docker-compose.prod.yml up -d'
                    
                    // Wait for services to start
                    sleep 30
                    
                    echo "✅ Application deployed successfully"
                }
            }
        }
        
        stage('Health Check') {
            steps {
                script {
                    echo "🏥 Performing health checks..."
                    
                    // Check if containers are running
                    sh '''
                        echo "📊 Running containers:"
                        docker ps
                    '''
                    
                    // Check backend health
                    sh '''
                        echo "🔍 Checking backend API..."
                        max_attempts=10
                        attempt=1
                        while [ $attempt -le $max_attempts ]; do
                            if curl -f http://localhost:5000/api/tasks; then
                                echo "✅ Backend is healthy"
                                break
                            else
                                echo "⏳ Backend not ready yet (attempt $attempt/$max_attempts)"
                                sleep 10
                                attempt=$((attempt + 1))
                            fi
                        done
                        if [ $attempt -gt $max_attempts ]; then
                            echo "❌ Backend health check failed after $max_attempts attempts"
                            exit 1
                        fi
                    '''
                    
                    // Check frontend health
                    sh '''
                        echo "🔍 Checking frontend..."
                        if curl -f http://localhost:80; then
                            echo "✅ Frontend is healthy"
                        else
                            echo "❌ Frontend health check failed"
                            exit 1
                        fi
                    '''
                    
                    echo "🎉 All health checks passed!"
                }
            }
        }
    }
    
    post {
        always {
            echo "🧹 Cleaning workspace..."
            cleanWs()
        }
        success {
            sh '''
                echo "🎉 DEPLOYMENT SUCCESSFUL!"
                echo "🌐 Your application is now live at:"
                echo "   Frontend: http://YOUR_EC2_IP"
                echo "   Backend API: http://YOUR_EC2_IP:5000"
                echo "   Swagger Docs: http://YOUR_EC2_IP:5000/swagger"
            '''
        }
        failure {
            echo "❌ DEPLOYMENT FAILED - Check the logs above for details"
        }
    }
}