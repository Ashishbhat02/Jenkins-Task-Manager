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
                script {
                    // Ensure .dotnet and .nuget directories exist with correct permissions
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
        }

        stage('Build Backend') {
            dir('TaskManagerAPI/TaskManagerAPI') {
                steps {
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
            dir('TaskManagerUI') {
                steps {
                    script {
                        // Install Node/NPM if needed
                        sh '''
                            if ! command -v npm &> /dev/null; then
                                echo "Node not installed, please install Node and NVM."
                                exit 1
                            fi
                        '''
                        sh '''
                            npm install
                            npm run build
                            npm test
                        '''
                    }
                }
            }
        }

        stage('Docker Build Backend') {
            dir('TaskManagerAPI') {
                steps {
                    sh '''
                        docker build -t taskmanager-backend:latest .
                    '''
                }
            }
        }

        stage('Docker Build Frontend') {
            dir('TaskManagerUI') {
                steps {
                    sh '''
                        docker build -t taskmanager-frontend:latest .
                    '''
                }
            }
        }

        stage('Deploy to Production') {
            steps {
                echo "Deploying backend and frontend containers to production..."
                // Add your deployment commands here (e.g., docker-compose, kubectl, ECS)
            }
        }

        stage('Health Check') {
            steps {
                echo "Running health checks..."
                // Add your health check commands here
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
