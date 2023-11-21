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
async function createApp(appData) {
  const app = { ...appData };
  // Generate a new app key
  app.key = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

  // Remove the servives key
  delete app.services;

  return knex("apps")
    .insert(app, "*")
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