const router = require('express').Router();
const builder = require('../builders/builder');

router.post('/', (req, res) => {
  const { name, services } = req.body;

  // Create a new database entry
  // TODO

  // Build the app
  builder.createApp(name, services);
});

module.exports = router;