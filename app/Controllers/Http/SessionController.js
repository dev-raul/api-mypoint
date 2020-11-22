"use strict";

const { validateAll, rule } = use("Validator");
const { required } = use("Utils/validatorMessage");
const User = use("App/Models/User");

class SessionController {
  async store({ request, response, auth }) {
    const rules = {
      email: "required|email",
      password: "required",
    };

    const validation = await validateAll(request.all(), rules);

    if (validation.fails()) {
      return validation.messages();
    }

    const { email, password } = request.only(["email", "password"]);

    const token = await auth.attempt(email, password);
    return token;
  }
}

module.exports = SessionController;
