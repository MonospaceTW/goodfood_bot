module.exports = class Services {
  constructor () {
    // export models to global
    global.models = require('../models');
  }
};
