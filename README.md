# new-project-template

## Deployment YAML Generator

This project includes a Bash script (`init.sh`) to help you quickly generate Kubernetes deployment YAML files for your services.

## About This Repository

This repository serves as a template for creating new projects. It provides a pre-configured structure and tools to streamline the setup process for Kubernetes-based deployments. The key features of this template include:

- **Deployment YAML Generator**: A Bash script (`init.sh`) to generate Kubernetes deployment, service, and optional ingress configurations.
- **Customizable Ingress**: Allows you to specify a subdomain for your service if ingress is required.
- **GitHub Actions Workflow**: Automates the deployment of your service to a Kubernetes cluster.

### How to Use This Template

1. **Clone or Use as a Template**:
   - Clone this repository or use the "Use this template" button on GitHub to create a new repository based on this template.

2. **Run the Deployment YAML Generator**:
   - Follow the instructions in the [Deployment YAML Generator](#deployment-yaml-generator) section to generate Kubernetes configuration files for your project.

3. **Customize Your Project**:
   - Update the generated YAML files or other configuration files as needed for your specific project requirements.

4. **Set Up GitHub Actions Workflow**:
   - This repository includes a pre-configured GitHub Actions workflow (`.github/workflows/deploy.yml`) to automate the deployment process.

5. **Trigger the Workflow**:
   - Push changes to the `main` branch to automatically deploy your service to the Kubernetes cluster.

### Example Workflow

The included GitHub Actions workflow (`deploy.yml`) uses the following configuration:

```yaml
name: Deploy to Kubernetes

on:
  push:
    branches:
      - main

jobs:
  deploy:
    uses: TheClusterFlux/central-workflows/.github/workflows/deploy.yaml@main
    with:
      docker_image_name: your-dockerhub-username/your-service-name
      deployment_file: deployment.yaml
    secrets:
      DOCKER_USERNAME: ${{ secrets.DOCKER_USERNAME }}
      DOCKER_PASSWORD: ${{ secrets.DOCKER_PASSWORD }}
      KUBECONFIG: ${{ secrets.KUBECONFIG }}