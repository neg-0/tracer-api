const router = require('express').Router();
const { execSync } = require('child_process');
const builder = require('../builders/builder');
const Dockerode = require('dockerode');

/**
 * Registers a new application with the hub.
 */
router.post('/register', (req, res) => {
  const appKey = req.body.appKey;

  // TODO: Add app to database
});

/**
 * Gets all applications registered with the hub.
 */
router.get('/', (req, res) => {
  // TODO: Get all apps from database
  res.send([]);
});


router.post('/create', async (req, res) => {
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

/**
 * Gets a specific application registered with the hub.
 */
router.get('/info/:appKey', (req, res) => {
  const appKey = req.params.appKey;

  // TODO: Get app from database
});

router.post('/keepalive', (req, res) => {
  const appKey = req.body.appKey;

  // TODO: Update app in database
});

module.exports = router;