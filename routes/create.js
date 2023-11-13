const router = require('express').Router();
const templates = require('../templates');

router.get('/', (req, res) => {
  res.send('Hello, World!');
});

router.get('/templates', (req, res) => {
  res.json(Object.keys(templates));
});

router.post('/app/:templateName', (req, res) => {
  const templateName = req.params.templateName;
  const template = templates[templateName];
  if (!template) {
    res.status(404).send('Template not found');
    return;
  }

  const appName = req.body.appName;
  const appKey = req.body.appKey;

  if (!appName || !appKey) {
    res.status(400).send('Missing appName or appKey');
    return;
  }

  template.createApp(appName, appKey);
});

module.exports = router;