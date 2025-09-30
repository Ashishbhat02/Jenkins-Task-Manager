pipeline {
    agent any
    environment {
        DOTNET_ROOT = "${WORKSPACE}/.dotnet"
        NUGET_PACKAGES = "${WORKSPACE}/.nuget"
    }
    stages {
        stage('Checkout SCM') {
            steps {
                checkout scm
            }
        }

        stage('Prepare Environment') {
            steps {
                sh '''
                    mkdir -p $WORKSPACE/.dotnet
                    mkdir -p $WORKSPACE/.nuget
                    chmod -R 775 $WORKSPACE/.dotnet
                    chmod -R 775 $WORKSPACE/.nuget
                    chown -R $(id -u):$(id -g) $WORKSPACE/.dotnet
                    chown -R $(id -u):$(id -g) $WORKSPACE/.nuget
                '''
            }
        }

        stage('Build Backend') {
            steps {
                dir('TaskManagerAPI/TaskManagerAPI') {
                    script {
                        def uid = sh(script: 'id -u', returnStdout: true).trim()
                        def gid = sh(script: 'id -g', returnStdout: true).trim()

                        withDockerContainer(image: 'mcr.microsoft.com/dotnet/sdk:5.0',
                                            args: "-u ${uid}:${gid} \
                                                   -v $WORKSPACE/.dotnet:/home/jenkins/.dotnet \
                                                   -v $WORKSPACE/.nuget:/home/jenkins/.nuget") {
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
                dir('TaskManagerUI') {
                    sh '''
                        npm install
                        npm run build
                        npm test
                    '''
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
                echo "Deploying backend and frontend containers..."
                // Add deployment commands here
            }
        }

        stage('Health Check') {
            steps {
                echo "Running health checks..."
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
