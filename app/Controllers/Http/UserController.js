"use strict";

const User = use("App/Models/User");

class UserController {
  /**
   *
   * @param {*} param0
   */
  async register({ request, response }) {
    let user = await User.create(request.all());

    return response.json(user);
  }
  /**
   *
   * @param {*} param0
   */
  async login({ auth, request, response }) {
    const { email, password } = request.all();

    try {
      let result = await auth.attempt(email, password);
      return result;
    } catch (error) {
      let errorUser = error.message.startsWith("E_USER_NOT_FOUND");
      let errorPass = error.message.startsWith("E_PASSWORD_MISMATCH");
      let info = { type: "another", message: error.message };

      if (errorUser) {
        info = { type: "user", message: "E_USER_NOT_FOUND" };
      } else if(errorPass) {
        info = { type: "pass", message: "E_PASSWORD_MISMATCH" };
      }
      return response.status(403).send(info);
    }
  }

  async show({ auth, params }) {
    if (auth.user.id !== Number(params.id)) {
      return "You cannot see someone als's profile";
    }
    return auth.user;
  }

  async logout({ request, response, auth }) {
    try {
      const isLogeddin = await auth.check();
      if (isLogeddin) {
        await auth.logout();
      }
      return response.status(401).send({ alert: "DESCONECTADO" });
    } catch (error) {
      response.status(401).send({ alert: "NOT_LOGGEDED" });
    }
  }
}

module.exports = UserController;
