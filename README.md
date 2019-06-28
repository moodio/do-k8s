# Moodio's DigitalOcean Kubernetes tasks

## Overview
Moodio's DigitalOcean Kubernetes Tasks is a collection (currently just 1) of tasks for more easily using the Kubernetes service from DigitalOcean with Azure Devops.

## Config Retriever Task
The config retriever task is a task used to get the config.yaml file required to connect to a DigitalOcean Kubernetes cluster to be used in tasks further down the chain.
The task can store the config.yaml in either a variable, or as a file in the working directory.

### How to use
To use the task:
1. Login to DigitalOcean and create a personal access token. For details [visit the guide on the DigitalOcean website]('https://www.digitalocean.com/docs/api/create-personal-access-token/')
2. Add the task to your **Digital Ocean Kubernetes Config Retriever** to your pipeline.
3. Enter the Personal Access Token into the input field labelled Personal Access Token
4. Enter the name of the cluster as it appears in your DigitalOcean dashboard into the field labled **Cluster name**
5. Choose where to save the config. Please note saving to a variable is currently in beta and may or may not work for you. So you're better off picking a path instead.
6. Your done. Now simply point any tasks that require the **config.yaml** file to the directory you have chosen, the filename will be stored as **{path}/config.yaml**. For example, if you are using it in the Kubernetes task, add the argument **--kube-config {path}/config.yaml**

### Using with YAML based build definitions
To use in a yaml based build definition, use the following definition, replacing in your own values and modify to your own needs. The below example however illustrates its usage for applying a YAML configuration file.

`- task: DO-K8S-Auth@0
  inputs:
    pat: '<PersonalAccessToken>'
    clusterName: '<KubernetesClusterName>'
    configOutput: file
    outputFilePath: $(Build.Repository.LocalPath)
    displayName: retrive access token`

To then use the configuration file within the Azure DevOps Kubernetes task, using the example of applying a YAML definition, use the below definition, replacing in your own values. For other commands type, modify as you see fit.
`- task: Kubernetes@1
  inputs:
    connectionType: 'None'
    command: 'apply'
    useConfigurationFile: true
    configuration: '$(Build.Repository.LocalPath)/$(projectDirectory)/k8s-deployment.yaml'
    arguments: '--kubeconfig $(Build.Repository.LocalPath)/config.yaml'
    secretType: 'dockerRegistry'
    containerRegistryType: 'Azure Container Registry'` 

### Comments, Feedback and Requests
If you have any comments, feedbacks or requests, please feel free to raise an issue in this repository. 