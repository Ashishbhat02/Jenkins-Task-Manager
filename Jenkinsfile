pipeline {
    agent any
    
    triggers {
        pollSCM('H/5 * * * *')  // Check GitHub every 5 minutes
    }
    
    environment {
        DOCKER_REGISTRY = ''  // Leave empty for local Docker
        BACKEND_IMAGE = 'taskmanager-backend'
        FRONTEND_IMAGE = 'taskmanager-frontend'
    }
    
    stages {
        stage('Checkout Code') {
            steps {
                checkout scm
                sh 'echo "Starting Task Manager CI/CD Pipeline"'
                sh 'ls -la'
            }
        }
        
        stage('Build Backend') {
            steps {
                dir('TaskManagerAPI/TaskManagerAPI') {
                    build job: 'taskmanager-backend', 
                          parameters: [
                            string(name: 'BRANCH', value: env.GIT_BRANCH)
                          ], 
                          wait: true,
                          propagate: false
                }
            }
        }
        
        stage('Build Frontend') {
            steps {
                dir('taskmanager-frontend') {
                    build job: 'taskmanager-frontend', 
                          parameters: [
                            string(name: 'BRANCH', value: env.GIT_BRANCH)
                          ], 
                          wait: true,
                          propagate: false
                }
            }
        }
        
        stage('Deploy to Production') {
            steps {
                script {
                    echo 'Deploying Task Manager Application...'
                    
                    // Stop and remove old containers
                    sh 'docker-compose -f docker-compose.prod.yml down || true'
                    
                    // Remove old images to free space
                    sh 'docker system prune -f || true'
                    
                    // Deploy new version
                    sh 'docker-compose -f docker-compose.prod.yml up -d'
                    
                    // Wait for services to start
                    sleep 30
                }
            }
        }
        
        stage('Health Check') {
            steps {
                script {
                    echo 'Performing health checks...'
                    
                    // Check backend
                    sh '''
                        echo "Checking backend service..."
                        curl -f http://localhost:5000/api/tasks || exit 1
                        echo "Backend is healthy ✅"
                    '''
                    
                    // Check frontend
                    sh '''
                        echo "Checking frontend service..."
                        curl -f http://localhost:80 || exit 1
                        echo "Frontend is healthy ✅"
                    '''
                    
                    // Show running containers
                    sh 'docker ps'
                }
            }
        }
    }
    
    post {
        always {
            echo 'Pipeline execution completed'
            cleanWs()  // Clean workspace
        }
        success {
            echo '🎉 Task Manager deployed successfully!'
            sh '''
                echo "Application URLs:"
                echo "Frontend: http://localhost:80"
                echo "Backend API: http://localhost:5000"
                echo "Swagger Docs: http://localhost:5000/swagger"
            '''
        }
        failure {
            echo '❌ Pipeline failed! Check the logs above.'
            // Send notification here if needed
        }
    }
}