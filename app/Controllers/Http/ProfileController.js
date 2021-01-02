"use strict";
const User = use("App/Models/User");

const Helpers = use("Helpers");
const fs = require("fs");

class ProfileController {
  async store({ request, response, auth, params }) {
    const file = request.file("file", {
      types: "image",
      size: "5mb",
      extnames: ["png", "jpg", "jpeg"],
    });
    if (auth.user.id !== parseInt(params.id)) {
      return response
        .status(401)
        .json({ error: "Você não tem permissão para realizar essa operação!" });
    }
    const user = await User.find(params.id);
    if (!user) {
      return response.status(404).json("Usuário não encontrado!");
    }

    const { clientName, type } = file;
    const name = `${Date.now()}-${clientName}`;
    await file.move(Helpers.tmpPath("uploads"), {
      name,
    });

    if (!file.moved()) {
      return file.error();
    }
    if (user.profile) {
      await fs.unlinkSync(Helpers.tmpPath(`uploads/${user.profile}`));
    }

    user.merge({ profile: name });
    await user.save();

    return response.status(201).json({ profile: name });
  }

}

module.exports = ProfileController;
