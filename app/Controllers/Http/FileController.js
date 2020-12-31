"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with files
 */

const Helpers = use("Helpers");
const File = use("App/Models/File");

const fs = require("fs");

class FileController {
    /**
   * Create/save a new file.
   * POST files
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async index({request, response, params, auth}){
    if (auth.user.id !== parseInt(params.user_id)) {
      return response.status(401).json({
        error: "Você não tempo permissão para realizar essa operação!",
      });
    }
    const files = await File.query().where({user_id: auth.user.id}).fetch()
    return files
  }
  /**
   * Create/save a new file.
   * POST files
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response, auth }) {
    const file = request.file("file", {
      types: "image",
      size: "5mb",
      extnames: ["png", "jpg", "jpeg"],
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
      user_id: auth.user.id,
      name,
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
  async update({ params, request, response, auth }) {
    const file = request.file("file", {
      types: "image",
      size: "2mb",
      extnames: ["png", "jpg", "jpeg"],
    });

    const files = await File.findBy({ name: params.id });

    if (!files) {
      return response
        .status(404)
        .json({ error: "O arquivo não foi encontrado!" });
    }

    if (auth.user.id !== files.user_id) {
      return response.status(401).json({
        error: "Você não tempo permissão para realizar essa operação!",
      });
    }

    await fs.unlinkSync(Helpers.tmpPath(`uploads/${files.name}`));

    const { clientName, type } = file;

    const name = `${Date.now()}-${clientName}`;
    await file.move(Helpers.tmpPath("uploads"), {
      name,
    });

    if (!file.moved()) {
      return file.error();
    }

    files.merge({
      user_id: auth.user.id,
      name,
      type,
      url: `file/${name}`,
    });
    await files.save();
    return response.status(200).json({ file: files });
  }

  /**
   * Delete a file with id.
   * DELETE files/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response, auth }) {
    const files = await File.findBy({ name: params.id });

    if (!files) {
      return response
        .status(404)
        .json({ error: "O arquivo não foi encontrado!" });
    }

    if (auth.user.id !== files.user_id) {
      return response.status(401).json({
        error: "Você não tempo permissão para realizar essa operação!",
      });
    }
    await fs.unlinkSync(Helpers.tmpPath(`uploads/${files.name}`));
    await files.delete();
    return response.status(200).send();
  }
}

module.exports = FileController;
