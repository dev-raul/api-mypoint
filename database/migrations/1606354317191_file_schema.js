"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class FileSchema extends Schema {
  up() {
    this.create("files", (table) => {
      table.increments();
      table
        .integer("user_id")
        .unsigned()
        .references("id")
        .inTable("users")
        .onDelete("CASCADE")
        .onUpdate("CASCADE")
        .notNullable();
      table.string("name").notNullable();
      table.string("type").notNullable();
      table.string("url").notNullable();
      table.timestamps();
    });
  }

  down() {
    this.drop("files");
  }
}

module.exports = FileSchema;
