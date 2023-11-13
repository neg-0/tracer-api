const init = require('init-package-json');

/**
 * Initializes a package in the specified directory.
 * @param {string} cwd - The current working directory.
 * @returns {Promise<any>} - A promise that resolves with the initialization data or rejects with an error.
 */
async function initPackage(cwd) {
  return new Promise((resolve, reject) => {
    init(cwd).then((data) => {
      resolve(data);
    }).catch((err) => {
      reject(err);
    });
  });
}

module.exports = {
  initPackage
};