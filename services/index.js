<<<<<<< HEAD
=======
require('../models').sequelize.sync();

const FireBaseService = require('./firebase');

>>>>>>> f8a6814e13acdb81620e09ca64051a706a451f87
module.exports = class Services {
  constructor () {
    // export models to global
    global.models = require('../models');
  }
};
