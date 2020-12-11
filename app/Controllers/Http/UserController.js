"use strict";
const { validateAll, rule } = use("Validator");
const { required } = use("Utils/validatorMessage");
const User = use("App/Models/User");

class UserController {
  async store({ request, response, session }) {
    // console.log(required("name"));
    // const messages = {
    //   "name.required": "The field is required",
    // };
    const rules = {
      name: "required",
      surname: "required",
      email: "required|email",
      cpf: "required|min:11|max:11",
      password: "required",
      type: [rule("required"), rule("integer"), rule("in", [1, 2, 3])],
    };

    const validation = await validateAll(request.all(), rules);

    if (validation.fails()) {
      return response.status(400).send(validation.messages());
    }

    const data = request.only([
      "name",
      "surname",
      "email",
      "password",
      "cpf",
      "type",
    ]);

    if (await User.findBy({ email: data.email.toLocaleLowerCase() })) {
      return response
        .status(400)
        .json({ error: "O e-mail já está cadastrado!" });
    }
    const user = await User.create(data);
    return user;
  }
  async update({ response, request, auth, params }) {
    const rules = {
      name: "string",
      surname: "string",
      cpf: "string|min:11|max:11",
      password: "string",
      confirmPassword: "string",
      type: [rule("integer"), rule("in", [1, 2, 3])],
    };

    const validation = await validateAll(request.all(), rules);

    if (validation.fails()) {
      return response.status(400).send(validation.messages());
    }

    const data = request.only(["name", "surname", "password", "cpf"]);
    const { confirmPassword } = request.only(["confirmPassword"]);
    if (auth.user.id !== parseInt(params.id)) {
      return response
        .status(401)
        .json({ error: "Você não tem permissão para realizar essa operação!" });
    }
    const user = await auth.getUser();
    if (!user) {
      return response.status(404).json({ error: "O usuário não existe!" });
    }
    if (data.password && data.password !== confirmPassword) {
      return response.status(400).json({ error: "As senhas não conferem!" });
    }
    user.merge(data);
    await user.save();
    return response.json({
      error: false,
      message: "O usuário foi editado!",
      user,
    });
  }
}

module.exports = UserController;
