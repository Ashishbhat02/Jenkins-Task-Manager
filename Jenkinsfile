pipeline {
    agent any

    environment {
        DOTNET_IMAGE = 'mcr.microsoft.com/dotnet/sdk:5.0'
        NODE_IMAGE = 'node:18'
    }

    stages {
        stage('Checkout SCM') {
            steps {
                checkout scm
            }
        }

        stage('Build Backend') {
            steps {
                dir('TaskManagerAPI/TaskManagerAPI') {
                    script {
                        docker.image(DOTNET_IMAGE).inside("-u $(id -u):$(id -g)") {
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
                dir('taskmanager-frontend') {
                    script {
                        docker.image(NODE_IMAGE).inside {
                            sh '''
                                npm install
                                npm run build
                            '''
                        }
                    }
                }
            }
        }

        stage('Run Frontend Tests') {
            steps {
                dir('taskmanager-frontend') {
                    script {
                        docker.image(NODE_IMAGE).inside {
                            sh 'npm test'
                        }
                    }
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
                sh 'docker build -t taskmanager-frontend:latest ./taskmanager-frontend'
            }
        }

        stage('Deploy to Production') {
            steps {
                echo 'Deployment step (add your commands here)'
            }
        }

        stage('Health Check') {
            steps {
                echo 'Health check step (add your commands here)'
            }
        }
    }

    post {
        always {
            cleanWs()
            echo '❌ Pipeline finished, check logs for details.'
        }
    }
}
