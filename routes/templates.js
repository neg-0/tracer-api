const router = require('express').Router();
const templates = require('../data/service_templates.json');

router.get('/', (req, res) => {
  res.send(templates)
});

module.exports = router;