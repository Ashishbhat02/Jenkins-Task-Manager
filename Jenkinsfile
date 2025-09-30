pipeline {
    agent any

    environment {
        DOTNET_IMAGE = 'mcr.microsoft.com/dotnet/sdk:5.0'
        NODE_VERSION = '18.16.0'
        NVM_DIR = "${env.HOME}/.nvm"
    }

    stages {
        stage('Declarative: Checkout SCM') {
            steps {
                checkout scm
            }
        }

        stage('Setup NVM & Node') {
            steps {
                sh '''
                    export NVM_DIR="$HOME/.nvm"
                    if [ -s "$NVM_DIR/nvm.sh" ]; then
                        . "$NVM_DIR/nvm.sh"
                        nvm install ${NODE_VERSION}
                        nvm use ${NODE_VERSION}
                    else
                        echo "NVM not found, please install NVM first."
                        exit 1
                    fi
                '''
            }
        }

        stage('Build Backend') {
            steps {
                dir('TaskManagerAPI/TaskManagerAPI') {
                    script {
                        docker.image(DOTNET_IMAGE).inside('-u $(id -u):$(id -g)') {
                            sh '''
                                dotnet restore
                                dotnet build --configuration Release
                            '''
                        }
                    }
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('TaskManagerUI/TaskManagerUI') {
                    sh '''
                        npm install
                        npm run build
                    '''
                }
            }
        }

        stage('Run Frontend Tests') {
            steps {
                dir('TaskManagerUI/TaskManagerUI') {
                    sh 'npm test'
                }
            }
        }

        stage('Docker Build Backend') {
            steps {
                sh 'docker build -t taskmanager-backend:latest ./TaskManagerAPI/TaskManagerAPI'
            }
        }

        stage('Docker Build Frontend') {
            steps {
                sh 'docker build -t taskmanager-frontend:latest ./TaskManagerUI/TaskManagerUI'
            }
        }

        stage('Deploy to Production') {
            steps {
                echo 'Deploying to production...'
                // Add your deployment commands here
            }
        }

        stage('Health Check') {
            steps {
                echo 'Performing health check...'
                // Add health check commands here
            }
        }
    }

    post {
        always {
            cleanWs()
            echo "❌ Pipeline finished, check logs for details."
        }
    }
}
