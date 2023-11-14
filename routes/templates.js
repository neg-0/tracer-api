const router = require('express').Router();
const temlatesController = require('../controllers/templatesController');

router
  .route('/')
  .get(temlatesController.getTemplates);

module.exports = router;