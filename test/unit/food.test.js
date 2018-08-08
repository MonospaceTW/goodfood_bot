'use strict';

var expect = require('expect.js');

describe('models/food', function () {

  before(function () {
    return require('../../models').sequelize.sync();
  });

  beforeEach(function () {
    // console.log("beforeEach!!");
    this.User = require('../../models').User;
    this.Food = require('../../models').Food;
  });

  it('create', function () {
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

  it('find one', function () {
    let food;
    const keyword = 'beef';
    const data = {
      name: keyword,
      price: 100,
    };
    before(async function () {
      // create a food before run test
      await this.Food.create(data);
    });

    it('find a food with where', async function () {
      const findFood = await this.Food.findOne({
        where: {
          name: 'beef'
        }
      })
      
      expect(findFood.name).to.equal(keyword);
    });
  });

  it('find all', function () {
    let foods = [];
    const keyword = ['chicken','hanberger', 'applepie'];
    const data1 = {
      name: keyword[0],
      price: 80,
    };
    const data2 = {
      name: keyword[1],
      price: 100,
    };
    const data3 = {
      name: keyword[2],
      price: 50,
    };
    const dataArray = [
      data1, data2 , data3
    ];

    const options = {
      where: {
        name: keyword[0],
        name: keyword[1],
        name: keyword[2]
      }
    };

    before(async function () {
      // create 3 foods and push into foods array.
      console.log('this=>', this);
      // await this.Food.create(data1);
      await this.Food.bulkCreate(dataArray);
    });

    it.only('find all food', async function () {
      const findFoods = await this.Food.findAll();
      // console.log('findFoods=>', findFoods);
      expect(findFoods.lengths).to.greaterThan(2);
    });

    it('find all with where', async function () {
      const findFoods = await this.Food.findAll(options);
      expect(findFoods.length).to.equal(1);
    });
  });

  it('destroy one', function () {
    let food;
    const keyword = 'destroydestroy';
    let options = {
      where: {
        name: keyword
      }
    };
    const data = {
      name: keyword,
      price: 100,
    };
    before(async function () {
      // create a food before run test
      await this.Food.create(data);
    });

    it('delete a food with where', async function () {
      const deleteFood = await this.Food.destroy(options);
      const findDeleteFood = await this.Food.findOne(options);
      expect(findDeleteFood).to.equal(null);
    });
  });
});
