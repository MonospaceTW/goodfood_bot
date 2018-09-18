// const Services = require('../services');
global.models = require('../models');
global.expect = require('expect.js');
global.faker = require('faker');
global.request = require('supertest');
// global.services = new Services();
global.express = require('../app');
global.logResponseBody = (res) => console.info('>=== ResponseBody ===<\n', res.body, '\n======================\n');
const modelBoot = require('../boostrap/models');

// do something before start testing.
before(async () => {
  await models.sequelize.sync();
  await modelBoot.resetDb();
  console.log('============================');
  console.log('models in app=>\n', Object.keys(models).filter(e => e.indexOf('equelize') === -1));
  console.log('============================\n');
});
