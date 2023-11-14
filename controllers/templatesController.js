const templates = require('../templates');

exports.getTemplates = (req, res) => {
  res.send(templates);
}