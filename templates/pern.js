const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const git = require('../builders/git');
const node = require('../builders/node');
const express = require('../builders/express');
const dockerCompose = require('../builders/dockerCompose');

function createApp(appName) {
  // Step 1: Create a new directory for the project in the PERN folder
  const projectPath = path.join(__dirname, 'PERN', appName);
  const clientPath = path.join(projectPath, 'client');
  const serverPath = path.join(projectPath, 'server');
  fs.mkdirSync(clientPath, { recursive: true });
  fs.mkdirSync(serverPath, { recursive: true });

  // Step 2: Initialize new git repositories in these directories
  git.gitInit(clientPath);
  git.gitInit(serverPath);

  // Step 3: Initialize new npm projects for the server. Client will be initialized by create-react-app
  // execSync('npm init -y', { cwd: clientPath });
  // execSync('npm init -y', { cwd: serverPath });
  node.initPackage(serverPath);

  // Step 4: In the client directory, set up a basic React app
  execSync('npx create-react-app .', { cwd: clientPath });

  // Step 5: In the server directory, set up a basic Express app with PostgreSQL integration
  express.createApp(serverPath);

  // Step 6: Install necessary dependencies for the server
  execSync('npm install express pg', { cwd });

  // Step 7: Commit the initial project setup to the git repositories
  git.gitAdd(clientPath, '.');
  git.gitCommit(clientPath, 'Initial commit');
  git.gitAdd(serverPath, '.');
  git.gitCommit(serverPath, 'Initial commit');

  // Step 8: At the root directory, create a docker-compose.yml file for easy local development
  dockerCompose.createComposeFile(projectPath);

  // Step 9: Publish the repositories to GitLab
  const gitlabUrl = 'https://gitlab.com/api/v4/projects';

  // Comment these out for now because I don't want to accidentally push to GitLab
  // git.gitPush(clientPath, gitlabUrl, 'main');
  // git.gitPush(serverPath, gitlabUrl, 'main');
}