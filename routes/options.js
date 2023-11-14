const router = require('express').Router();
const optionsController = require('../controllers/optionsController');

router
  .route('/')
  .get(optionsController.getOptions);

module.exports = router;