const Docker = require('dockerode');
// Connect to the local Docker daemon
const docker = new Docker({ socketPath: '/var/run/docker.sock' });

/**
 * Starts a Docker container.
 * @param {string} containerName 
 */
function startContainer(containerName) {
  return docker.getContainer(containerName).start();
}

/**
 * Stops a Docker container.
 * @param {string} containerName 
 */
function stopContainer(containerName) {
  return docker.getContainer(containerName).stop();
}

/**
 * Removes a Docker container.
 * @param {string} containerName 
 */
function removeContainer(containerName) {
  return docker.getContainer(containerName).remove();
}

/**
 * Get all Docker containers.
 */
function getContainers() {
  return docker.listContainers();
}

module.exports = {
  startContainer,
  stopContainer,
  removeContainer,
  getContainers
};