const router = require('express').Router();

/**
 * Registers a new application with the hub.
 */
router.post('/register', (req, res) => {
  const appKey = req.body.appKey;

  // TODO: Add app to database
});

/**
 * Gets all applications registered with the hub.
 */
router.get('/', (req, res) => {
  // TODO: Get all apps from database
  res.send([]);
});

/**
 * Gets a specific application registered with the hub.
 */
router.get('/:appKey', (req, res) => {
  const appKey = req.params.appKey;

  // TODO: Get app from database
});

router.post('/keepalive', (req, res) => {
  const appKey = req.body.appKey;

  // TODO: Update app in database
});

module.exports = router;