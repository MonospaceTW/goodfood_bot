'use strict';

var expect = require('expect.js');

describe('models/food', function () {

  before(function () {
    return require('../../models').sequelize.sync();
  });

  beforeEach(function () {
    this.User = require('../../models').User;
    this.Food = require('../../models').Food;
  });

  describe('create', function () {
    it('creates a food', async function () {
      const data = {
        name: 'a price',
        price: 100,
      };
      const newFood = await this.Food.create(data);
      expect(newFood.name).to.equal(data.name);
      expect(newFood.price).to.equal(data.price);
    });
  });

  describe('find one', function () {
    let food;
    const keyword = 'ggg';
    const data = {
      name: keyword,
      price: 100,
    };
    before(function () {
      // create a food before run test
    });

    it('find a food with where', function () {
      const findFood;
      
      expect(findFood.name).to.equal(keyword);
    });
  });

  describe('find all', function () {
    let foods = [];
    const keyword = 'abc';
    const data1 = {
      name: keyword,
      price: 100,
    };
    const data2 = {
      name: '222',
      price: 100,
    };
    const data3 = {
      name: '333',
      price: 100,
    };

    before(function () {
      // create 3 foods and push into foods array.
    });

    it('find all food', function () {
      const findFoods;
      expect(findFoods.lengths).to.greaterThan(2);
    });

    it('find all with where', function () {
      const findFoods;
      expect(findFoods.length).to.equal(1);
    });
  });


  describe('destroy one', function () {
    let food;
    const keyword = 'destroydestroy';
    const data = {
      name: keyword,
      price: 100,
    };
    before(function () {
      // create a food before run test
    });

    it('delete a food with where', function () {
      const deleteFood;
      
      const findDeleteFood;
      expect(findDeleteFood).to.equal(null);
    });
  });
});
