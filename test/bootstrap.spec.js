global.models = require('../models');
global.expect = require('expect.js');
global.faker = require('faker');
global.faker = require('faker');
global.request = require('supertest');
global.express = require('../app');
global.logResponseBody = (res) => console.info(res.body);

// do something before start testing.
before(async () => {
  await models.sequelize.sync();
  console.log('============================');
  console.log('models in app=>\n', Object.keys(models).filter(e => e.indexOf('equelize') === -1));
  console.log('============================\n');
});
