'use strict';

var expect = require('expect.js');

describe('models/food', () => {

  before(function () {
  });

  beforeEach(function () {
    // console.log("beforeEach!!");
  });

  describe('Create model data', function () {
    it('creates a food', async function () {
      const data = {
        name: 'a price',
        price: 100,
      };
      const newFood = await models.Food.create(data);
      expect(newFood.name).to.equal(data.name);
      expect(newFood.price).to.equal(data.price);
    });
  });

  describe('Update model data', function () {
    const data = {
      name: 'abc',
      price: 100,
    };
    let food;
    before(async function () {
      // create a food before run test
      food = await models.Food.create(data);
    });

    it('update a food', async function () {
      const data = {
        name: 'a price',
        price: 1000,
      };
      const options = {
        where: {
          name : 'abc',
          price : 100
        }
      };
      // console.log('food=>',food);
      let updatedFood = await food.update(data, options);
      
      // console.log('updatedFood.name=>',updatedFood.name);
      expect(updatedFood.name).to.equal(data.name);
      expect(updatedFood.price).to.equal(data.price);
    });
  });

  describe('Find one model data', function () {
    let food;
    const keyword = 'beef';
    const data = {
      name: keyword,
      price: 100,
    };
    before(async function () {
      // create a food before run test
      await models.Food.create(data);
    });

    it('find a food with where', async function () {
      const findFood = await models.Food.findOne({
        where: {
          name: 'beef'
        }
      })
      
      expect(findFood.name).to.equal(keyword);
    });
  });

  describe('Find all model data', function () {
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
      // await models.Food.create(data1);
      await models.Food.bulkCreate(dataArray);
    });

    it('find all food', async function () {
      const findFoods = await models.Food.findAll();
      expect(findFoods.length).to.greaterThan(2);
    });

    it('find all with where', async function () {
      const findFoods = await models.Food.findAll(options);
      expect(findFoods.length).to.equal(1);
    });
  });

  describe('Destroy model data', function () {
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
      await models.Food.create(data);
    });

    it('delete a food with where', async function () {
      const deleteFood = await models.Food.destroy(options);
      const findDeleteFood = await models.Food.findOne(options);
      expect(findDeleteFood).to.equal(null);
    });
  });
});
