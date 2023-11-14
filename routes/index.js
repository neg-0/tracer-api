const router = require('express').Router();

router.get('/', (req, res) => {
  res.send('TRACER API');
});

router.use('/releases', require('./releases'));
router.use('/apps', require('./apps'));
router.use('/options', require('./options'));
router.use('/templates', require('./templates'));

module.exports = router;