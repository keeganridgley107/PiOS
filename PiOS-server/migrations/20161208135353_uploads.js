'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.createTable('uploads', function(table) {
    // id
    table.increments().notNullable();
    // name
    table.string('name').notNullable();
    // path
    table.string('file_name').notNullable();
    // category
    table.string('category').notNullable();
    // user_id
    table.integer('user_id').notNullable().references('users.id').onDelete('CASCADE');
    // created_at
    table.timestamps(true, true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('uploads');
};
