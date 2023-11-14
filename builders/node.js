const { execSync } = require('child_process');
const init = require('init-package-json');
const path = require('path');

/**
 * Initializes a package.json in the specified directory.
 * @param {string} cwd - The current working directory.
 * @param {object} service - The service object.
 */
async function initPackage(cwd, service) {

  const defaultPackageJson = path.join(__dirname, '..', 'defaultFiles', 'expressPackageJson.js');
  let { name, type, dependencies, devDependencies, subdirectory } = service;

  dependencies = {
    express: '^4.17.1',
    cors: '^2.8.5',
    ...dependencies
  };

  devDependencies = {
    nodemon: '^2.0.7',
    ...devDependencies
  };

  const config = {
    silent: true,
    yes: true
  };

  await init(cwd, defaultPackageJson, config, (err, data) => {
    if (err) {
      console.error('Error initializing package.json:', err);
      return;
    }
    console.log('Successfully initialized package.json');
  });

  // Install dependencies
  if (dependencies && dependencies.length > 0) { execSync(`npm install ${Object.keys(dependencies).join(' ')}`, { cwd }); }

  // Install devDependencies
  if (devDependencies && devDependencies.length > 0) { execSync(`npm install -D ${Object.keys(devDependencies).join(' ')}`, { cwd }); }

  // Run npm install
  execSync('npm install', { cwd });
}

module.exports = {
  initPackage
};