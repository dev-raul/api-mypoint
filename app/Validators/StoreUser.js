"use strict";

class StoreUser {
  get rules() {
    return {
      // validation rules
      name: "required",
      surname: "required",
      email: "required|email|unique:users",
      cpf: "required|min:11|max:11",
      password: "required",
      type: "integer|required|in:1,2,3",
    };
  }
}

module.exports = StoreUser;
