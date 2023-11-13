const router = require('express').Router();

router.get('/', (req, res) => {
  res.send('TRACER API');
});

router.use('/releases', require('./releases'));
router.use('/create', require('./create'));
router.use('/apps', require('./apps'));
router.use('/languages', require('./languages'));
router.use('/options', require('./options'));
router.use('/templates', require('./templates'));

module.exports = router;