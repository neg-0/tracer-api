const knex = require("../middleware/knex");

/**
 * Create a new service
 */
async function createService(service, appId) {
  delete service.id;
  service.app_id = appId;
  return knex("services")
    .insert(service, "*")
    .then((service) => {
      return service[0];
    });
}

async function createServices(appData) {
  const { services, id } = appData;
  return Promise.all(services.map((service) => {
    return createService(service, id);
  }));
}

module.exports = {
  createService,
  createServices,
};