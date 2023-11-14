const fs = require('fs');
const path = require('path');

function createComposeFile(cwd, services) {
  const dockerCompose = `
version: '3'
services:
  client:
    build: ./client
    ports:
      - "3000:3000"
    depends_on:
      - server
  server:
    build: ./server
    ports:
      - "3001:3001"
    depends_on:
      - db
  db:
    image: postgres
    ports:
      - "5432:5432"
    environment:
      POSTGRES_PASSWORD: password
      POSTGRES_USER: postgres
      POSTGRES_DB: postgres
    volumes:
      - ./db:/var/lib/postgresql/data
volumes:
  db:
`;

  fs.writeFileSync(path.join(cwd, 'docker-compose.yml'), dockerCompose);
}

module.exports = {
  createComposeFile
};