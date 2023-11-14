const router = require('express').Router();
const appController = require('../controllers/appController');

router
  .route('/')
  .get(appController.getApps)
  .post(appController.createApp);

router
  .route('/:appId')
  .get(appController.getApp);

module.exports = router;