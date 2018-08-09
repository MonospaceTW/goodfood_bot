'use strict';

var expect = require('expect.js');
var models = require('../../models');

describe('models/index', function () {
<<<<<<< HEAD:test/unit/index.test.js
  before(function () {
    return require('../../models').sequelize.sync();
  });
  
  it('returns the food model', function () {
    expect(models.Food).to.be.ok();
  });

  it('returns the user model', function () {
=======
  it.skip('returns the task model', function () {
    var models = require('../../../models');
    expect(models.Task).to.be.ok();
  });

  it('returns the user model', function () {
    var models = require('../../../models');
>>>>>>> ee610e0af4a9fad85e10a409d285cc17c90206c1:test/unit/models/index.test.js
    expect(models.User).to.be.ok();
  });

  it('returns the order model', function () {
    expect(models.Order).to.be.ok();
  });
});