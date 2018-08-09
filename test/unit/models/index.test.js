'use strict';

var expect = require('expect.js');
var models = require('../../models');

describe('models/index', function () {
  it.skip('returns the task model', function () {
    var models = require('../../../models');
    expect(models.Task).to.be.ok();
  });

  it('returns the user model', function () {
    var models = require('../../../models');
    expect(models.User).to.be.ok();
  });

  it('returns the order model', function () {
    expect(models.Order).to.be.ok();
  });
});