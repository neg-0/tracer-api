const router = require('express').Router();
const { execSync } = require('child_process');
const builder = require('../builders/builder');
const Dockerode = require('dockerode');
const path = require('path');

router.post('/', async (req, res) => {
  const { name, services } = req.body;

  // Create a new database entry
  // TODO

  // Build the app
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
    const container = containers.find(container => container.Names[0].includes(projectName + '-' + service.subdirectory));
    const port = container?.Ports[0].PublicPort;
    ports[service.name] = port;
  }

  console.log('Ports:', ports);
  console.log('App built successfully');
});

module.exports = router;