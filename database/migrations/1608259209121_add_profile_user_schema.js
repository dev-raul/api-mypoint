"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class AddProfileUserSchema extends Schema {
  up() {
    this.alter("users", (table) => {
      table.string("profile");
    });
  }

  down() {
    this.alter("users", (table) => {
      table.dropColumn("profile");
    });
  }
}

module.exports = AddProfileUserSchema;
