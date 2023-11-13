const router = require('express').Router();

router.get('/', (req, res) => {
  res.send(['javascript'])
});

module.exports = router;