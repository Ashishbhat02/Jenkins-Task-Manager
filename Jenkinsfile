pipeline {
    agent any

    environment {
        FRONTEND_DIR = 'taskmanager-frontend'
        BACKEND_DIR = 'TaskManagerAPI/TaskManagerAPI'
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/Ashishbhat02/Jenkins-Task-Manager'
            }
        }

        stage('Build Backend') {
            steps {
                dir(BACKEND_DIR) {
                    docker.image('mcr.microsoft.com/dotnet/sdk:5.0').inside {
                    sh 'dotnet restore'
                    sh 'dotnet build --configuration Release'
                    sh 'dotnet publish -c Release -o publish'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir(FRONTEND_DIR) {
                    echo "Building frontend..."
                    sh 'npm install'
                    sh 'npm run build'
                    archiveArtifacts artifacts: 'build/**', allowEmptyArchive: true
                }
            }
        }

        stage('Run Frontend Tests') {
            steps {
                dir(FRONTEND_DIR) {
                    echo "Running frontend tests..."
                    sh 'npm test -- --watchAll=false --coverage || true'
                    publishHTML(target: [
                        reportName: 'Frontend Test Coverage',
                        reportDir: 'coverage/lcov-report',
                        allowMissing: true
                    ])
                }
            }
        }

        stage('Docker Build Backend') {
            steps {
                dir(BACKEND_DIR) {
                    sh 'docker build -t taskmanager-backend:latest .'
                }
            }
        }

        stage('Docker Build Frontend') {
            steps {
                dir(FRONTEND_DIR) {
                    sh 'docker build -t taskmanager-frontend:latest .'
                }
            }
        }

        stage('Deploy to Production') {
            steps {
                echo "Deployment stage - add your deployment commands here"
            }
        }

        stage('Health Check') {
            steps {
                echo "Health check stage - add your API or UI health check commands here"
            }
        }
    }

    post {
        success {
            echo "✅ Pipeline completed successfully!"
        }
        failure {
            echo "❌ Pipeline failed! Check logs for details."
        }
        always {
            cleanWs()
        }
    }
}
