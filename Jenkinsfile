pipeline {
    agent any
    environment {
        NODE_VERSION = '18.16.0'  // Node version for frontend
        DOTNET_ROOT = '$PWD/.dotnet'
    }
    stages {

        stage('Checkout SCM') {
            steps {
                checkout scm
            }
        }

        stage('Setup NVM & Node') {
            steps {
                sh '''
                    export NVM_DIR="$HOME/.nvm"
                    [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
                    nvm install ${NODE_VERSION}
                    nvm use ${NODE_VERSION}
                    node -v
                    npm -v
                '''
            }
        }

        stage('Build Backend') {
            steps {
                dir('TaskManagerAPI/TaskManagerAPI') {
                    script {
                        docker.image('mcr.microsoft.com/dotnet/sdk:5.0').inside('-u $(id -u):$(id -g)') {
                            sh '''
                                mkdir -p $DOTNET_ROOT
                                export DOTNET_ROOT=$DOTNET_ROOT
                                dotnet restore
                                dotnet build --configuration Release
                                dotnet publish -c Release -o publish
                            '''
                        }
                    }
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('taskmanager-frontend') {
                    sh '''
                        npm install
                        npm run build
                    '''
                    archiveArtifacts artifacts: 'build/**', allowEmptyArchive: true
                }
            }
        }

        stage('Run Frontend Tests') {
            steps {
                dir('taskmanager-frontend') {
                    sh 'npm test -- --watchAll=false --coverage || true'
                    publishHTML([allowMissing: true, alwaysLinkToLastBuild: true, 
                        keepAll: true, reportDir: 'coverage/lcov-report', 
                        reportFiles: 'index.html', reportName: 'Frontend Test Coverage'])
                }
            }
        }

        stage('Docker Build Backend') {
            steps {
                dir('TaskManagerAPI/TaskManagerAPI') {
                    sh 'docker build -t taskmanager-backend:latest .'
                }
            }
        }

        stage('Docker Build Frontend') {
            steps {
                dir('taskmanager-frontend') {
                    sh 'docker build -t taskmanager-frontend:latest .'
                }
            }
        }

        stage('Deploy to Production') {
            steps {
                echo 'Deploy to production server (implement your deployment here)'
            }
        }

        stage('Health Check') {
            steps {
                echo 'Perform health check (implement your check here)'
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
