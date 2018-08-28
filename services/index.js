
const JwtService = require('./jwt');
const UserService = require('./user');
module.exports = class Services {
  constructor () {
    // export models to global
    global.models = require('../models');
    global.jwtService = new JwtService();
    global.userService = new UserService();
  }
};
