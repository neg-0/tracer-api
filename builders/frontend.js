const { execSync } = require('child_process');
const docker = require('../builders/docker');

/**
 * Initializes all files needed for a frontend service.
 * @param {string} cwd 
 * @param {{}} service 
 */
function init(projectPath, servicePath, service) {
  // In the client directory, set up a basic React app
  execSync(`npx create-react-app ${service.subdirectory}`, { cwd: projectPath });

  // Write the dockerfile for this service
  docker.createDockerFile(servicePath, service);
}

module.exports = {
  init
};