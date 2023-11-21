const { execSync } = require('child_process');
const Dockerode = require('dockerode');
const builder = require('../builders/builder');
const Service = require('../models/services');
const App = require('../models/apps');
const Deployment = require('../models/deployments');

exports.getApps = async (req, res) => {
  try {
    const apps = await App.getApps();
    if (!apps) {
      res.status(404).json({
        status: 'error',
        message: 'No apps found'
      });
      return;
    }
    res.status(200).json({
      status: 'success',
      data: {
        apps
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};

exports.getApp = async (req, res) => {
  try {
    const app = await App.getApp(req.params.appId);
    res.status(200).json({
      status: 'success',
      data: {
        app
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};

exports.createApp = async (req, res) => {
  const appData = req.body;

  console.log('Creating app:', appData);

  // Create a new database entry for each service
  let services = await Service.createServices(appData);

  let deployments = [];

  // Build the app files
  const { projectPath, servicePaths } = await builder.createApp(appData);
  console.log(`Building app... ${appData.name}`);

  const docker = new Dockerode();

  // Run docker compose up
  execSync(`docker compose -p ${projectName} up -d`, { cwd: projectPath });

  // Get running containers
  const containers = await docker.listContainers();

  // Get the exposed ports for each service
  const ports = {};
  for (const service of services) {
    const container = containers.find(container => container.Names[0].includes(projectName + '-' + service.subdirectory));
    const port = container?.Ports[0].PublicPort;
    ports[service.name] = port;

    // Add deployment to database
    const deployment = await Deployment.createDeployment(service.subdirectory, `http://localhost:${port}`, service.id);
    deployments.push(deployment);

    console.log('Deployment:', deployment)
  }

  console.log('Ports:', ports);
  console.log('App built successfully');

  // Create a new database entry
  const { id } = await App.createApp(appData);

  // Find the first service that is a frontend and add its address to the app
  const frontendService = services.find(service => service.type === 'frontend');
  if (frontendService) {
    await App.updateApp(id, { address: frontendService.address });
  }

  res.status(201).json({
    status: 'success',
    data: {
      projectPath,
      servicePaths,
      name,
      services,
      deployments,
      ports
    }
  });
}