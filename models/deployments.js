const knex = require("../middleware/knex");

/**
 * Adds a deployment to the database
 */
async function createDeployment(name, address, serviceId) {
  return knex("deployments")
    .insert({
      name: name,
      address: address,
      service_id: serviceId,
    }, "*")
    .then((deployment) => {
      return deployment[0];
    });
}

/**
 * Updates the last_alive timestamp for a deployment with the given address.
 * @param {string} address - The address of the deployment to update.
 * @returns {Promise} A Promise that resolves to the number of rows updated.
 */
async function keepAliveDeployment(address) {
  return knex("deployments")
    .where("address", "=", address)
    .update({
      last_alive: knex.fn.now(),
    });
}

module.exports = {
  createDeployment,
  keepAliveDeployment,
};