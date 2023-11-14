const node = require('../builders/node');
const express = require('../builders/express');
const docker = require('../builders/docker');

/**
 * Initializes all files needed for a backend service.
 * @param {string} cwd 
 * @param {{}} service 
 */
function init(projectPath, servicePath, service) {
  // Initialize new npm projects for the server. Client will be initialized by builder
  node.initPackage(servicePath, service);

  // In the server directory, set up a basic Express app with PostgreSQL integration
  if (service.framework === 'express') { express.createApp(servicePath, service); }

  // Write the dockerfile for this service
  docker.createDockerFile(servicePath, service);
}

module.exports = {
  init
};