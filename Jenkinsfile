pipeline {
  agent any

  environment {
    DOCKERHUB_USER = 'your-dockerhub-username'
    IMAGE_BACKEND = "${DOCKERHUB_USER}/docugenai-backend"
    IMAGE_FRONTEND = "${DOCKERHUB_USER}/docugenai-frontend"
    IMAGE_AI = "${DOCKERHUB_USER}/docugenai-ai"
  }

  stages {
    stage('Checkout') {
      steps {
        git 'https://github.com/your-org/docugenai.git'
      }
    }

    stage('Build Docker Images') {
      steps {
        sh 'docker build -t $IMAGE_BACKEND ./backend'
        sh 'docker build -t $IMAGE_FRONTEND ./frontend'
        sh 'docker build -t $IMAGE_AI ./ai-service'
      }
    }

    stage('Run Tests') {
      steps {
        sh 'docker run --rm $IMAGE_BACKEND npm test || true'
        sh 'docker run --rm $IMAGE_AI pytest || true'
      }
    }

    stage('Push to Docker Hub') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
          sh 'echo $PASSWORD | docker login -u $USERNAME --password-stdin'
          sh 'docker push $IMAGE_BACKEND'
          sh 'docker push $IMAGE_FRONTEND'
          sh 'docker push $IMAGE_AI'
        }
      }
    }
  }
}
