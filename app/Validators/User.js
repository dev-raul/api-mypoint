"use strict";
const { rule } = use("Validator");
class User {
  get rules() {
    return {
      // validation rules
      name: "required",
      surname: "required",
      email: "required|email|unique:users",
      cpf: "required|min:11|max:11",
      password: "",
    };
  }
}

module.exports = User;
