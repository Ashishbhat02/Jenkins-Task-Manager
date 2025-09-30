pipeline {
    agent any

    environment {
        DOTNET_ROOT = "${WORKSPACE}/.dotnet"
        NUGET_PACKAGES = "${WORKSPACE}/.nuget"
        HOME = "${WORKSPACE}"
    }

    stages {
        stage('Checkout SCM') {
            steps {
                checkout([$class: 'GitSCM',
                          branches: [[name: '*/main']],
                          userRemoteConfigs: [[url: 'https://github.com/Ashishbhat02/Jenkins-Task-Manager']]])
            }
        }

        stage('Prepare Environment') {
            steps {
                sh '''
                    mkdir -p $DOTNET_ROOT
                    mkdir -p $NUGET_PACKAGES
                    chmod -R 775 $DOTNET_ROOT $NUGET_PACKAGES
                '''
            }
        }

        stage('Build Backend') {
            steps {
                dir('TaskManagerAPI/TaskManagerAPI') {
                    script {
                        def uid = sh(script: 'id -u', returnStdout: true).trim()
                        def gid = sh(script: 'id -g', returnStdout: true).trim()

                        withDockerContainer(
                            image: 'mcr.microsoft.com/dotnet/sdk:5.0',
                            args: "-u ${uid}:${gid} \
                                   -v $WORKSPACE/.dotnet:/home/jenkins/.dotnet \
                                   -v $WORKSPACE/.nuget:/home/jenkins/.nuget"
                        ) {
                            sh '''
                                export DOTNET_ROOT=/home/jenkins/.dotnet
                                export NUGET_PACKAGES=/home/jenkins/.nuget
                                mkdir -p $DOTNET_ROOT
                                mkdir -p $NUGET_PACKAGES
                                dotnet restore
                                dotnet build --configuration Release
                                dotnet test --no-build
                            '''
                        }
                    }
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('TaskManagerFrontend') {
                    sh '''
                        npm install
                        npm run build
                    '''
                }
            }
        }

        stage('Docker Build Backend') {
            steps {
                dir('TaskManagerAPI') {
                    sh '''
                        docker build -t taskmanager-backend:latest .
                    '''
                }
            }
        }

        stage('Docker Build Frontend') {
            steps {
                dir('TaskManagerFrontend') {
                    sh '''
                        docker build -t taskmanager-frontend:latest .
                    '''
                }
            }
        }

        stage('Deploy to Production') {
            steps {
                sh '''
                    echo "Deploying backend and frontend containers to production..."
                    # Add your deployment commands here (docker-compose, kubectl, etc.)
                '''
            }
        }

        stage('Health Check') {
            steps {
                sh '''
                    echo "Performing health checks..."
                    # Add your health check scripts here
                '''
            }
        }
    }

    post {
        always {
            cleanWs()
            echo "✅ Pipeline finished"
        }
        failure {
            echo "❌ Pipeline failed, check logs for details"
        }
    }
}
