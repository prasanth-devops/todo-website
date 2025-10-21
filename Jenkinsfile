pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = 'dockerhub-credentials'
        DOCKER_IMAGE = 'prasanthr25/todo-website'
        EC2_HOST = '16.171.150.61'
        EC2_USER = 'ec2-user'
        PEM_PATH = '/var/lib/jenkins/todo-key0ne.pem' // adjust if stored elsewhere
        CONTAINER_NAME = 'todo-website'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'master',
                    url: 'https://github.com/prasanth-devops/todo-website.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    dockerImage = docker.build("${DOCKER_IMAGE}:latest")
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    docker.withRegistry('', DOCKERHUB_CREDENTIALS) {
                        dockerImage.push('latest')
                    }
                }
            }
        }

        stage('Deploy to AWS EC2') {
            steps {
                script {
                    sshCommand remote: [
                        name: 'ec2-server',
                        host: "${EC2_HOST}",
                        user: "${EC2_USER}",
                        identityFile: "${PEM_PATH}",
                        allowAnyHosts: true
                    ], command: """
                        docker pull ${DOCKER_IMAGE}:latest
                        docker stop ${CONTAINER_NAME} || true
                        docker rm ${CONTAINER_NAME} || true
                        docker run -d -p 80:80 --name ${CONTAINER_NAME} ${DOCKER_IMAGE}:latest
                    """
                }
            }
        }
    }

    post {
        success {
            echo "✅ Deployment successful! App running on http://${EC2_HOST}"
        }
        failure {
            echo "❌ Deployment failed!"
        }
    }
}
