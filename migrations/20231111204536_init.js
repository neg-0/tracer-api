/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable('users', table => {
      table.increments('id');
      table.string('username').unique();
      table.string('github_username').unique();
      table.string('github_access_token');
      table.timestamps();
    })
    .createTable('apps', table => {
      table.increments('id');
      table.string('name');
      table.string('project_name');
      table.string('deployment_type');
      table.string('key').unique();
      table.string('address');
      table.integer('user_id').unsigned().references('id').inTable('users');
      table.timestamps();
    })
    .createTable('services', table => {
      table.increments('id');
      table.string('name');
      table.string('language');
      table.string('technology');
      table.string('framework');
      table.string('database');
      table.string('subdirectory');
      table.string('runtime');
      table.string('type');
      table.integer('app_id').unsigned().references('id').inTable('apps');
      table.timestamps();
    })
    .createTable('deployments', table => {
      table.increments('id');
      table.string('name');
      table.string('address');
      table.string('docker_image');
      table.string('docker_container');
      table.integer('service_id').unsigned().references('id').inTable('services');
      table.time('deployed_at').defaultTo(knex.fn.now());
      table.time('last_alive').defaultTo(knex.fn.now());
      table.timestamps();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('deployments').dropTable('services').dropTable('apps').dropTable('users');
};
