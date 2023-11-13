const fs = require('fs');
const path = require('path');

function createApp(cwd) {
  const serverCode = `
  const express = require('express');
  const app = express();

  app.get('/', (req, res) => {
    res.send('Hello, World!');
  }

  app.listen(3001, () => console.log('Server running on port 3001'));
`;

  fs.writeFileSync(path.join(cwd, 'server.js'), serverCode);
}

module.exports = {
  createApp
};