const fs = require('fs');
const path = require('path');
const findFreePort = require('find-free-port-sync');

function createComposeFile(cwd, app) {

  const services = app.services;

  let ports;
  // If running locally, get free ports
  if (app.deploymentType === 'local') {
    ports = findFreePort({
      start: 4000,
      end: 4999,
      num: services.length,
    });
  }

  // For any 'database' type services, create a volumne for persistent data
  let volumes = {};
  const databaseDataLocations = {
    postgres: '/var/lib/postgresql/data',
    mysql: '/var/lib/mysql',
    mongodb: '/data/db',
    redis: '/data',
  }

  services.filter(service => service.type === 'database').forEach(service => {
    volumes[service.name] = {
      volumeName: `${service.name}-data`,
      localStorageLocation: `./volumes/${service.name}`,
      remoteStorageLocation: databaseDataLocations[service.database]
    };
  });

  const dockerServices = services.map((service, index) => {

    // Generate the depends_on property
    let depends_on = [];
    if (service.type === 'backend') {
      depends_on = services.filter(s => s.type === 'database').map(s => s.name);
    } else if (service.type === 'frontend') {
      depends_on = services.filter(s => s.type === 'backend').map(s => s.name);
    }

    return `
  ${service.name}:
    build: ./${service.subdirectory}
    ${ports.length > 0 ? 'ports:' : ''}
    ${ports.length > 0 ? `  - ${ports[index]}:${service.port}` : ''}
    ${depends_on.length > 0 ? 'depends_on:' : ''}
    ${depends_on.length > 0 ? `  - ${depends_on.join('\n    - ')}` : ''}
    ${service.environmentVariables ? 'environment:' : ''}
    ${service.environmentVariables ? service.environmentVariables.map(variable => `  - ${variable}`).join('\n') : ''}
    ${volumes.length > 0 ? 'volumes:' : ''}
    ${volumes.length > 0 ? `  - ${volumes[service.name].volumeName}:${volumes[service.name].remoteStorageLocation}` : ''}
`;
  }
  ).join('\n');



  const dockerCompose = `
version: "3.9"
services:
${dockerServices}
${volumes.length > 0 ? 'volumes:' : ''}
${volumes.length > 0 ? Object.keys(volumes).map(volume => `  ${volumes[volume].volumeName}:
    driver: local
    driver_opts:
      type: none
      o: bind
      device: ${volumes[volume].localStorageLocation}`).join('\n') : ''}
`;

  fs.writeFileSync(path.join(cwd, 'docker-compose.yml'), dockerCompose);
}

module.exports = {
  createComposeFile
};