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
      table.string('key').unique();
      table.integer('user_id').unsigned().references('id').inTable('users');
      table.timestamps();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('apps').dropTable('users');
};
