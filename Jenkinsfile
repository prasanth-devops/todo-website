pipeline {
    agent any

    environment {
        GIT_CREDENTIALS = 'github-https'          // Jenkins GitHub credentials ID
        DOCKER_HUB_CREDENTIALS = 'dockerhub-credentials' // Jenkins Docker Hub credentials ID
        DOCKER_IMAGE_NAME = 'prasanthr25/todo-website:latest'
        EC2_USER = 'ec2-user'
        EC2_HOST = '16.171.150.61'
        PEM_FILE = '/var/lib/jenkins/todo-key0ne.pem'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'master', 
                    url: 'https://github.com/prasanth-devops/todo-website.git',
                    credentialsId: "${GIT_CREDENTIALS}"
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    docker.withRegistry('', "${DOCKER_HUB_CREDENTIALS}") {
                        def dockerImage = docker.build("${DOCKER_IMAGE_NAME}")
                        dockerImage.push()
                    }
                }
            }
        }

        stage('Deploy to AWS EC2') {
            steps {
                script {
                    sh """
                    ssh -o StrictHostKeyChecking=no -i ${PEM_FILE} ${EC2_USER}@${EC2_HOST} '
                        docker stop todo-website || true
                        docker rm todo-website || true
                        docker pull ${DOCKER_IMAGE_NAME}
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
