'use strict';
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function(table) {
    // id
    table.increments().notNullable();
    // username
    table.string('username').notNullable();
    // hashed password
    table.string('password').notNullable();
    // email
    table.string('email').notNullable();
    // created_at
    table.timestamps(true, true);
    // create path to avatar image
    table.string('avatar_path');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
};
