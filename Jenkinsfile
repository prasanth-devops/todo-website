pipeline {
    agent any

    environment {
        DOCKER_HUB_CREDENTIALS = 'dockerhub-credentials' // Jenkins credentials ID
        DOCKER_IMAGE_NAME = 'prasanthr25/todo-website:latest'
        EC2_USER = 'ec2-user'
        EC2_HOST = '16.171.150.61'
        PEM_FILE = '/var/lib/jenkins/todo-key0ne.pem'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'master', url: 'https://github.com/prasanth-devops/todo-website.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    // Ensure no cached invalid login
                    sh 'docker logout || true'
                    // Build image
                    def dockerImage = docker.build("${DOCKER_IMAGE_NAME}")
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', "${DOCKER_HUB_CREDENTIALS}") {
                        def dockerImage = docker.image("${DOCKER_IMAGE_NAME}")
                        dockerImage.push()
                    }
                }
            }
        }

        stage('Deploy to AWS EC2') {
            steps {
                script {
                    // Copy Docker image deploy script or run commands via SSH
                    sh """
                    ssh -o StrictHostKeyChecking=no -i ${PEM_FILE} ${EC2_USER}@${EC2_HOST} '
                        docker login -u prasanthr25 -p ${DOCKER_HUB_CREDENTIALS}
                        docker pull ${DOCKER_IMAGE_NAME}
                        docker stop todo-website || true
                        docker rm todo-website || true
                        docker run -d --name todo-website -p 80:80 ${DOCKER_IMAGE_NAME}
                    '
                    """
                }
            }
        }
    }

    post {
        success {
            echo '✅ Deployment succeeded!'
        }
        failure {
            echo '❌ Deployment failed!'
        }
    }
}
