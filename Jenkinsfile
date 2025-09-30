pipeline {
    agent any

    environment {
        DOTNET_ROOT = "${WORKSPACE}/.dotnet"
        NUGET_PACKAGES = "${WORKSPACE}/.nuget"
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
                    chown -R 111:113 $DOTNET_ROOT $NUGET_PACKAGES
                '''
            }
        }

        stage('Build Backend') {
            steps {
                dir('TaskManagerAPI/TaskManagerAPI') {
                    script {
                        withDockerContainer(
                            image: 'mcr.microsoft.com/dotnet/sdk:5.0',
                            args: '-u 0:0 -v $WORKSPACE/.dotnet:/home/jenkins/.dotnet -v $WORKSPACE/.nuget:/home/jenkins/.nuget'
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
                sh 'docker build -t taskmanager-backend ./TaskManagerAPI/TaskManagerAPI'
            }
        }

        stage('Docker Build Frontend') {
            steps {
                sh 'docker build -t taskmanager-frontend ./TaskManagerFrontend'
            }
        }

        stage('Deploy to Production') {
            steps {
                echo 'Deploy steps go here'
            }
        }

        stage('Health Check') {
            steps {
                echo 'Health check steps go here'
            }
        }
    }

    post {
        always {
            cleanWs()
        }
        success {
            echo '✅ Pipeline finished successfully!'
        }
        failure {
            echo '❌ Pipeline failed, check logs for details'
        }
    }
}
