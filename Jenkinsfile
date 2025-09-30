pipeline {
    agent any
    environment {
        DOTNET_IMAGE = 'mcr.microsoft.com/dotnet/sdk:5.0'
        NODE_IMAGE = 'node:18.16.0'
        DOTNET_HOME = "${env.WORKSPACE}/.dotnet"   // Host folder for .NET SDK
        NUGET_HOME = "${env.WORKSPACE}/.nuget"     // Host folder for NuGet packages
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
                        // Run Docker as Jenkins user
                        def uid = sh(script: 'id -u', returnStdout: true).trim()
                        def gid = sh(script: 'id -g', returnStdout: true).trim()

                        docker.image(DOTNET_IMAGE).inside(
                            "-u ${uid}:${gid} " +
                            "-v ${DOTNET_HOME}:/home/jenkins/.dotnet " +
                            "-v ${NUGET_HOME}:/home/jenkins/.nuget"
                        ) {
                            sh '''
                                export DOTNET_ROOT=/home/jenkins/.dotnet
                                export NUGET_PACKAGES=/home/jenkins/.nuget
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
