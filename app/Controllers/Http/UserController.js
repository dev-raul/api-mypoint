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
      email: "required|email|unique:users",
      cpf: "required|min:11|max:11",
      password: "required",
      type: [rule("required"), rule("integer"), rule("in", [1, 2, 3])],
    };

    const validation = await validateAll(request.all(), rules);

    if (validation.fails()) {
      return validation.messages();

      return response.redirect("back");
    }

    return response.send("OK");
  }
}

module.exports = UserController;
