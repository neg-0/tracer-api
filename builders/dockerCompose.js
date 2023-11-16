const fs = require('fs');
const path = require('path');

function createComposeFile(cwd, services) {

  // For each service with sevice.exportPort === true, add a port to the docker-compose.yml file
  const numOfPorts = services.filter(service => service.exportPort).length;

  const dockerServices = services.map(service => {
    return `
  ${service.name}:
    build: ./${service.subdirectory}
    ${service.exportPort ? 'ports:' : ''}
    ${service.exportPort ? `  - "${service.port}:${service.port}"` : ''}
    depends_on:
      - ${service.dependsOn.join('\n      - ')}
    ${service.environmentVariables ? 'environment:' : ''}
    ${service.environmentVariables ? service.environmentVariables.map(variable => `  - ${variable}`).join('\n') : ''}
    ${service.volumes ? 'volumes:' : ''}
    ${service.volumes ? service.volumes.map(volume => `  - ${volume}`).join('\n') : ''}
`;
  }
  ).join('\n');

  // If any service requires persistent data, add a volume to the docker-compose.yml file
  let volumes = '';
  if (services.some(service => service.persistent)) {
    volumes = `
volumes:
${services.filter(service => service.persistent).map(service => `  ${service.name}:`).join('\n')}
`;
  }


  const dockerCompose = `
version: "3.9"
services:
${dockerServices}
${volumes}
`;

  fs.writeFileSync(path.join(cwd, 'docker-compose.yml'), dockerCompose);
}

module.exports = {
  createComposeFile
};