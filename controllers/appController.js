const { execSync } = require('child_process');
const Dockerode = require('dockerode');
const builder = require('../builders/builder');
const Service = require('../models/services');
const App = require('../models/apps');
const Deployment = require('../models/deployments');

exports.getApps = async (req, res) => {
  try {
    const apps = await App.getApps();
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
    const app = await App.getApp(req.params.appKey);
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
  const { name, services } = req.body;

  // Create a new database entry
  App.createApp(name);

  // Build the app files
  const { projectPath, servicePaths } = await builder.createApp(name, services);
  const projectName = name.replace(/\s/g, '-').toLowerCase();
  console.log(`Building app... ${name}`);

  const docker = new Dockerode();

  // Run docker compose up
  execSync(`docker compose -p ${projectName} up -d`, { cwd: projectPath });

  // Get running containers
  const containers = await docker.listContainers();

  // Get the exposed ports for each service
  const ports = {};
  for (const service of services) {

    // Add the service to the database
    const { id } = Service.createService(service);

    const container = containers.find(container => container.Names[0].includes(projectName + '-' + service.subdirectory));
    const port = container?.Ports[0].PublicPort;
    ports[service.name] = port;

    // Add deployment to database
    const deployment = Deployment.createDeployment(service.subdirectory, `http://localhost:${port}`, id);
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
      ports
    }
  });
}