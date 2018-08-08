const FireBaseService = require('./firebase');

module.exports = class Services {
  constructor () {
    global.firebaseService = new FireBaseService();

    // export models to global
    global.models = require('../models');
  }
};
