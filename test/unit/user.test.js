'use strict';

var expect = require('expect.js');
var models = require('../../models');

describe('models/task', function () {

  describe('create', function () {
    it('creates a user',async function () {
      const User = await models.User.create({
        nickName: 'John Doe',
        email: 'test@gmail.com'
      });
      expect(User.nickName).to.eql('John Doe');
      expect(User.email).to.eql('test@gmail.com')
    });
  });
});