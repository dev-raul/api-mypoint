"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class UserSchema extends Schema {
  up() {
    this.create("users", (table) => {
      table.increments();
      table.string("name", 60).notNullable();
      table.string("surname", 60).notNullable();
      table.string("email", 254).notNullable().unique();
      table.string("cpf", 11).notNullable();
      table.string("password", 60).notNullable();
      table.string("resetToken").defaultTo(null);
      table.datetime("expiryToken").defaultTo(null);
      table.integer("type").defaultTo(1).notNullable();
      table.timestamps();
    });
  }

  down() {
    this.drop("users");
  }
}

module.exports = UserSchema;
