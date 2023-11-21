const path = require('path');
const fs = require('fs');
const git = require('../builders/git');
const dockerCompose = require('../builders/dockerCompose');


/**
 * Creates a new application with the given name and services.
 * @param {string} appName - The name of the application.
 * @param {Array<Object>} services - An array of service objects.
 * @returns {{projectPath: string, appName: string, services: Array<Object>}} - An object containing the project path, app name, and services.
 */
async function createApp(app) {
  const { name: appName, services } = app;
  console.log(`Creating app... ${appName}`);

  // Create a new directory for the project at root/output
  const projectPath = path.join(__dirname, '..', 'output', appName);

  const servicePaths = {};

  // Delete the output directory if it already exists
  if (fs.existsSync(projectPath)) { fs.rmSync(projectPath, { recursive: true }); }

  for (const service of services) {
    console.log(`Creating ${service.type} service... ${service.name}`);

    // The path to the service directory
    const servicePath = path.join(projectPath, service.subdirectory);

    // Save the service path for later
    servicePaths[service.name] = servicePath;

    // Create a new directory
    fs.mkdirSync(servicePath, { recursive: true });

    // Initialize new git repositories
    git.gitInit(servicePath);

    // Get the builder for the service type
    const builder = require('./' + service.type);

    // Run the builder
    await builder.init(projectPath, path.join(projectPath, service.subdirectory), service);

    // Commit the initial project setup to the git repositories
    git.gitAdd(servicePath, '.');
    git.gitCommit(servicePath, 'Initial commit');

    // Publish the repositories to GitLab
    // const gitlabUrl = 'https://gitlab.com/api/v4/projects';

    // Comment these out for now so we don't create a GitLab repo
    // git.gitPush(servicePath, gitlabUrl, 'main');

  }

  // At the root directory, create a docker-compose.yml file for easy local development
  dockerCompose.createComposeFile(projectPath, app);

  console.log('App created!');

  return { projectPath, servicePaths, appName, services };
}

module.exports = {
  createApp
};