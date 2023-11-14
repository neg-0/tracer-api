const config = require('./middleware/config');
const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const knex = require('./middleware/knex');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.use('/', routes);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});