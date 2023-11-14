const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const git = require('../builders/git');
const node = require('../builders/node');
const express = require('../builders/express');
const dockerCompose = require('../builders/dockerCompose');
const docker = require('../builders/docker');

function createApp(appName, services) {
  console.log('Creating app...');
  console.log(appName);
  console.log(services);

  // Create a new directory for the project at root/output
  const projectPath = path.join(__dirname, '..', 'output', appName);

  // Delete the output directory if it already exists
  if (fs.existsSync(projectPath)) { fs.rmSync(projectPath, { recursive: true }); }

  services.forEach(service => {
    const servicePath = path.join(projectPath, service.subdirectory);

    // Create a new directory
    fs.mkdirSync(servicePath, { recursive: true });

    // Initialize new git repositories
    git.gitInit(servicePath);

    // Get the builder for the service type
    const builder = require('./' + service.type);

    // Run the builder
    builder.init(projectPath, path.join(projectPath, service.subdirectory), service);

    // Commit the initial project setup to the git repositories
    git.gitAdd(servicePath, '.');
    git.gitCommit(servicePath, 'Initial commit');

    // Publish the repositories to GitLab
    // const gitlabUrl = 'https://gitlab.com/api/v4/projects';

    // Comment these out for now so we don't create a GitLab repo
    // git.gitPush(servicePath, gitlabUrl, 'main');

  });

  // At the root directory, create a docker-compose.yml file for easy local development
  dockerCompose.createComposeFile(projectPath, services);

  console.log('App created!');
}

module.exports = {
  createApp
};