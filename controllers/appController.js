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
  const { name, projectName, services: reqServices } = req.body;

  // Create a new database entry
  const app = await App.createApp(name, projectName);

  // Create a new database entry for each service
  let services = await Service.createServices(reqServices, app.id);

  let deployments = [];

  // Build the app files
  const { projectPath, servicePaths } = await builder.createApp(name, services);
  console.log(`Building app... ${name}`);

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

    // If the service is the frontend, add the deployment address to the app
    if (service.type === 'frontend') {
      await App.updateApp(app.id, { address: deployment.address });
    }
  }

  console.log('Ports:', ports);
  console.log('App built successfully');

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