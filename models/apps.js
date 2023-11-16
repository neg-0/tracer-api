const knex = require("../middleware/knex");

/**
 * Get all applications registered with the hub.
 */
async function getApps() {
  return knex("apps").select("*")
    .then((apps) => {
      return apps;
    });
}

/**
 * Get a specific application registered with the hub.
 */
async function getApp(appKey) {
  return knex("apps")
    .select("*")
    .where("project_name", "=", appKey)
    .first();
}

/**
 * Add a new application.
 */
async function createApp(name, projectName) {
  return knex("apps")
    .insert({ name, project_name: projectName }, "*")
    .then((app) => {
      return app[0];
    });
}

/**
 * Update an application.
 */
async function updateApp(id, app) {
  return knex("apps")
    .where("id", "=", id)
    .update(app, "*")
    .then((app) => {
      return app[0];
    });
}

/**
 * Delete an application.
 */
function deleteApp(appKey) {
  // Delete the app from the database
  // Delete the services from the database

  knex.transaction((trx) => {
    trx("apps")
      .where("key", "=", appKey)
      .del()
      .then((app) => {
        trx("services")
          .where("key", "=", appKey)
          .del()
          .then((service) => {
            return service;
          });
      });
  });
}

module.exports = {
  getApps,
  getApp,
  createApp,
  updateApp,
  deleteApp,
};