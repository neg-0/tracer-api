// Get all json files in this templates directory and return the json contents in an array

const fs = require('fs');
const path = require('path');
const files = fs.readdirSync(path.join(__dirname));
// Aggregate all json files in this directory into an array
// If the template does not include a name or any services, ignore it and log an error
const templates = files.filter(file => file.endsWith('.json'))
  .reduce((templates, file) => {
    const template = require(path.join(__dirname, file));
    if (!template.name || !template.services) {
      console.error(`Template ${file} is missing a name or services.`);
    } else {
      templates.push(template);
    }
    return templates;
  }, []);

module.exports = templates;