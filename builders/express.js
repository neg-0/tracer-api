const fs = require('fs');
const path = require('path');

function createApp(cwd, service) {

  const port = service.port || 3000;

  const serverCode = `
  const express = require('express');
  const app = express();

  app.get('/', (req, res) => {
    res.send('Hello, World!');
  });

  app.listen(${port}, () => console.log('Server running on port ${port}'));
`;

  fs.writeFileSync(path.join(cwd, 'app.js'), serverCode);
}

module.exports = {
  createApp
};