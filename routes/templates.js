const router = require('express').Router();
const templates = require('../templates');

router.get('/', (req, res) => {
  res.send(templates)
});

module.exports = router;