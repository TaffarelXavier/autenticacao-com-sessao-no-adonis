"use strict";

const User = use('App/Models/User');

class UserController {
    
  async register({ auth, request, response }) {
    let user = await User.create(request.all());

    //generate token for user;
    //let token = await auth.generate(user);

    Object.assign(user, token);

    return response.json(user);
  }


  async login({ auth, request }) {
    const { email, password } = request.all();

    let result = await auth.attempt(email, password);
  
    return result;
  }

  async show({ auth, params }) {
    if (auth.user.id !== Number(params.id)) {
      return "You cannot see someone als's profile";
    }
    return auth.user;
  }

}

module.exports = UserController;
