'use strict';

var expect = require('expect.js');
var models = require('../../models');

describe('models/index', function () {
  before(function () {
    return require('../../models').sequelize.sync();
  });
  
  it('returns the food model', function () {
    expect(models.Food).to.be.ok();
  });

  it('returns the user model', function () {
    expect(models.User).to.be.ok();
  });

  it('returns the order model', function () {
    expect(models.Order).to.be.ok();
  });
});