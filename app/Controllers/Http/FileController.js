"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with files
 */

const Helpers = use("Helpers");
const File = use("App/Models/File");

class FileController {
  /**
   * Create/save a new file.
   * POST files
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {
    const file = request.file("file", {
      types: "image",
      size: "2mb",
      extnames: ["png", "jpg"],
    });

    const { clientName, type } = file;
    const name = `${Date.now()}-${clientName}`;
    await file.move(Helpers.tmpPath("uploads"), {
      name,
    });

    if (!file.moved()) {
      return file.error();
    }

    const fileRes = await File.create({
      name: clientName,
      type,
      url: `file/${name}`,
    });

    return response.status(201).json({ file: fileRes });
  }

  /**
   * Display a single file.
   * GET files/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {
    response.download(Helpers.tmpPath(`uploads/${params.id}`));
  }

  /**
   * Update file details.
   * PUT or PATCH files/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {}

  /**
   * Delete a file with id.
   * DELETE files/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {}
}

module.exports = FileController;
