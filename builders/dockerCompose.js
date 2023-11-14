const fs = require('fs');
const path = require('path');

function createComposeFile(cwd, services) {
  const dockerCompose = `
version: '3'
services:
  client:
    build: ./client
    ports:
      - "4000:3000"
    depends_on:
      - server
  server:
    build: ./server
    ports:
      - "4001:3000"
    depends_on:
      - database
  database:
    image: postgres
    ports:
      - "5432:5432"
    environment:
      POSTGRES_PASSWORD: password
      POSTGRES_USER: postgres
      POSTGRES_DB: postgres
    volumes:
      - ./database-data:/var/lib/postgresql/data
volumes:
  database-data:
`;

  fs.writeFileSync(path.join(cwd, 'docker-compose.yml'), dockerCompose);
}

module.exports = {
  createComposeFile
};