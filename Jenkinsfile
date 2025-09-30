pipeline {
    agent any
    environment {
        DOTNET_IMAGE = 'mcr.microsoft.com/dotnet/sdk:5.0'
        NODE_IMAGE = 'node:18.16.0'
        DOTNET_HOME = "${env.WORKSPACE}/.dotnet"
        NUGET_HOME = "${env.WORKSPACE}/.nuget"
        CONTAINER_HOME = "/home/jenkins"
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
                        def uid = sh(script: 'id -u', returnStdout: true).trim()
                        def gid = sh(script: 'id -g', returnStdout: true).trim()

                        docker.image(DOTNET_IMAGE).inside(
                            "-u ${uid}:${gid} " +
                            "-e HOME=${CONTAINER_HOME} " +
                            "-v ${DOTNET_HOME}:${CONTAINER_HOME}/.dotnet " +
                            "-v ${NUGET_HOME}:${CONTAINER_HOME}/.nuget " +
                            "-w ${WORKSPACE}/TaskManagerAPI/TaskManagerAPI"
                        ) {
                            sh '''
                                export DOTNET_ROOT=${HOME}/.dotnet
                                export NUGET_PACKAGES=${HOME}/.nuget
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
                    script {
                        docker.image(NODE_IMAGE).inside {
                            sh 'npm install'
                            sh 'npm run build'
                        }
                    }
                }
            }
        }

        stage('Run Frontend Tests') {
            steps {
                dir('TaskManagerUI/TaskManagerUI') {
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
                dir('TaskManagerAPI') {
                    sh 'docker build -t taskmanager-backend:latest .'
                }
            }
        }

        stage('Docker Build Frontend') {
            steps {
                dir('TaskManagerUI') {
                    sh 'docker build -t taskmanager-frontend:latest .'
                }
            }
        }

        stage('Deploy to Production') {
            steps {
                echo "Deploying backend and frontend Docker images..."
            }
        }

        stage('Health Check') {
            steps {
                echo "Checking application health..."
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
