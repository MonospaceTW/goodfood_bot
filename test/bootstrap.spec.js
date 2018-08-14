global.models = require('../models');
global.expect = require('expect.js');
global.faker = require('faker');

// do something before start testing.
before(async () => {
  await models.sequelize.sync();
  console.log('models=>', models);
});
