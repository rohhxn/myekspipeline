pipeline {
    agent any

    environment {
        // !!! IMPORTANT: Change 'rohhxn' if your Docker Hub username is different !!!
        DOCKER_IMAGE_NAME = "rohhxn/myapp" 
        KUBE_CONFIG = credentials('kubeconfig')
    }

    stages {
        // NOTE: The 'Checkout Code' stage is removed.
        // Jenkins automatically checks out the code before the pipeline starts.

        stage('Build Docker Image') {
            steps {
                script {
                    def imageTag = "${env.BUILD_NUMBER}"
                    // docker.build uses the Docker plugin
                    docker.build("${DOCKER_IMAGE_NAME}:${imageTag}", ".")
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    def imageTag = "${env.BUILD_NUMBER}"
                    // docker.withRegistry handles login/logout using the stored credential
                    docker.withRegistry('https://registry.hub.docker.com', 'dockerhub-credentials') {
                        docker.image("${DOCKER_IMAGE_NAME}:${imageTag}").push()
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    def imageTag = "${env.BUILD_NUMBER}"
                    // Use a temporary copy of the deployment file for replacement
                    sh 'cp deployment.yaml deployment-temp.yaml'
                    // Replace the placeholder with the new image tag
                    sh "sed -i 's|__IMAGE_TAG__|${imageTag}|g' deployment-temp.yaml"

                    // Kubernetes CLI plugin provides withKubeconfig
                    withKubeconfig([credentialsId: 'kubeconfig', context: 'default']) {
                        sh 'kubectl apply -f deployment-temp.yaml'
                        sh 'kubectl apply -f service.yaml'
                        sh 'echo "Waiting for deployment to complete..."'
                        sh 'kubectl rollout status deployment/myapp-deployment'
                    }
                }
            }
        }
    }
}
