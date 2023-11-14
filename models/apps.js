const knex = require("knex");

/**
 * Get all applications registered with the hub.
 */
function getApps() {
  knex("apps").select("*").then((apps) => {
    return apps;
  });
}

/**
 * Get a specific application registered with the hub.
 */
function getApp(appKey) {
  knex("apps")
    .select("*")
    .where("key", "=", appKey)
    .then((app) => {
      return app;
    });
}

/**
 * Add a new application.
 */
function createApp(name, services) {
  // Create a transaction to ensure that all database operations succeed
  // Add the app to the database
  // Add the services to the database

  knex.transaction((trx) => {
    trx("apps")
      .insert({
        name: name,
      })
      .then((app) => {
        for (const service of services) {
          trx("services")
            .insert({
              name: service.name,
              language: service.language,
              technology: service.technology,
              framework: service.framework,
              database: service.database,
              subdirectory: service.subdirectory,
              runtime: service.runtime,
              type: service.type,
            })
            .then((service) => {
              return service;
            });
        }
      });
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
  deleteApp,
};