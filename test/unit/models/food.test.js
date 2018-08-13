'use strict';

const expect = require('expect.js');

describe('models/food', () => {
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
          name: 'abc',
          price: 100,
        },
      };
      const updatedFood = await food.update(data, options);
      expect(updatedFood.name).to.equal(data.name);
      expect(updatedFood.price).to.equal(data.price);
    });
  });

  describe('Find one model data', function () {
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
          name: 'beef',
        },
      });

      expect(findFood.name).to.equal(keyword);
    });
  });

  describe('Find all model data', function () {
    const foodKeywords = [ 'chicken', 'hanberger', 'applepie', ];
    const [ firstKeyword, secondKeyword, thirdKeyword, ] = foodKeywords;

    const data1 = {
      name: firstKeyword,
      price: 80,
    };
    const data2 = {
      name: secondKeyword,
      price: 100,
    };
    const data3 = {
      name: thirdKeyword,
      price: 50,
    };
    const dataArray = [
      data1, data2, data3,
    ];

    before(async function () {
      // create 3 foods and push into foods array.
      await models.Food.bulkCreate(dataArray);
    });

    it('find all food', async function () {
      const findFoods = await models.Food.findAll();
      expect(findFoods.length).to.greaterThan(2);
    });

    it('find all with where', async function () {
      let findFoods = await models.Food.findAll({ where: { name: `${firstKeyword}`, }, });
      expect(findFoods.length).to.equal(1);
    });
  });

  describe('Destroy model data', function () {
    const keyword = 'destroydestroy';
    const options = {
      where: {
        name: keyword,
      },
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
      await models.Food.destroy(options);
      const findDeleteFood = await models.Food.findOne(options);
      expect(findDeleteFood).to.equal(null);
    });
  });
});
