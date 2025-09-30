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
                    script {
                        docker.image('mcr.microsoft.com/dotnet/sdk:5.0').inside {
                            sh 'dotnet restore'
                            sh 'dotnet build --configuration Release'
                            sh 'dotnet publish -c Release -o publish'
                        }
                    }
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir(FRONTEND_DIR) {
                    sh '''
                        # Install nvm
                        curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.6/install.sh | bash
                        export NVM_DIR="$HOME/.nvm"
                        [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

                        # Install and use Node 18
                        nvm install 18
                        nvm use 18

                        # Verify versions
                        node -v
                        npm -v

                        # Install dependencies and build
                        npm install
                        npm run build
                    '''
                    archiveArtifacts artifacts: 'build/**', allowEmptyArchive: true
                }
            }
        }

        stage('Run Frontend Tests') {
            steps {
                dir(FRONTEND_DIR) {
                    sh '''
                        export NVM_DIR="$HOME/.nvm"
                        [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
                        nvm use 18
                        npm test -- --watchAll=false --coverage || true
                    '''
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
