'use strict';

const modelName = 'Restaurant';
const fakeData = {
  create: {
    name: faker.name.findName(),
    address: faker.address.streetAddress(),
  },
  update: {
    name: faker.name.findName(),
    address: faker.address.streetAddress(),
  },
  updateNewData: {
    name: faker.name.findName(),
    address: faker.address.streetAddress(),
  },
  updateNewData2: {
    name: faker.name.findName(),
    address: faker.address.streetAddress(),
  },
  findOne: {
    name: 'keyword',
    address: faker.address.streetAddress(),
  },
  findAll: [
    {
      name: 'keyword',
      address: faker.address.streetAddress(),
    },
    {
      name: 'keyword',
      address: faker.address.streetAddress(),
    },
    {
      name: 'keyword',
      address: faker.address.streetAddress(),
    },
  ],
  destroy: {
    name: faker.name.findName(),
    address: faker.address.streetAddress(),
  },
  keyword: {
    name: 'keyword',
  },
};

describe.skip(`models/${modelName}`, () => {
  before(() => {
  });

  beforeEach(() => {
  });

  describe('Create model data', () => {
    it('creates a data', async () => {
      // TODO: 
      // 1. model.create(fakeData.create)...
      // 2. use data from `fakeData.create`
      let createdModel = null;

      Object.keys(fakeData.create).forEach(e => {
        expect(createdModel[e]).to.equal(fakeData.create[e]);
      });
    });
  });

  describe('Update model data', () => {
    let modelDataForUpdate = null;
    before(async () => {
      // create a model data before run test
      modelDataForUpdate = await models[modelName].create(fakeData.update);
    });

    it('update a model with find and save', async () => {
      // TODO:
      // 1. use model.find(modelId === updatedModel.id) then model.save();
      // 2. use data from `fakeData.updateNewData`
      // 3. use `findAndUpdatedModel` as target, `modelDataForUpdate.id` as condition.
      let findAndUpdatedModel = null;

      Object.keys(fakeData.updateNewData).forEach(e => {
        expect(findAndUpdatedModel[e]).to.equal(fakeData.updateNewData[e]);
      });
    });

    it('update a model with update method', async () => {
      // TODO:
      // 1. use model.update()...
      // 2. use data from `fakeData.updateNewData2`
      // 3. use `updateModel` as target, `modelDataForUpdate.id` as condition.
      let updateModel = null;

      Object.keys(fakeData.updateNewData2).forEach(e => {
        expect(updateModel[e]).to.equal(fakeData.updateNewData2[e]);
      });
    });
  });

  describe('Find one model data', () => {
    let modelDateForFind = null;
    before(async () => {
      // create a model before run test
      modelDateForFind = await models[modelName].create(fakeData.findOne);
    });

    it('find a model with findOne', async () => {
      // TODO:
      // 1. use model.findOne...
      // 2. use data from `fakeData.findOne`
      // 3. use `findModel` as target, `modelDateForFind.id` as option.
      let findModel = null;

      Object.keys(fakeData.findOne).forEach(e => {
        expect(findModel[e]).to.equal(fakeData.findOne[e]);
      });
    });
  });

  describe('Find all model data', () => {
    before(async () => {
      // create 3 models and push into models array.
      // await models[modelName].create(data1);
      await models[modelName].bulkCreate(fakeData.findAll);
    });

    it('find all model', async () => {
      // TODO:
      // 1. use model.findAll...
      // 2. use data from `fakeData.findAll`
      // 3. use `findAllModel` as target.
      let findAllModel = null;

      expect(findAllModel.length).to.greaterThan(fakeData.findAll.length - 1);
    });

    it('find all with where', async () => {
      // TODO:
      // 1. use model.findAll...
      // 2. use data from `fakeData.findAll`
      // 3. use `findAllModel` as target, and use `fakeData.keyword` as option.
      let findAllModel = null;

      expect(findAllModel.length).to.greaterThan(fakeData.findAll.length - 1);
      Object.keys(fakeData.findAll).forEach(e => {
        expect(findAllModel[e]).to.equal(fakeData.findAll[e]);
      });
    });
  });

  describe('Destroy model data', () => {
    let modelDataForDestroy = null;
    before(async () => {
      // create data before run test
      modelDataForDestroy = await models[modelName].create(fakeData.destroy);
    });

    it('delete a model data with where', async () => {
      // TODO:
      // 1. use model.destroy...
      // 2. use data from `fakeData.findAll`
      // 3. use `findAllModel` as target, and use `modelDataForDestroy.id` as option.
      let deleteModel = null;
      let findDeleteModel = null;
      expect(deleteModel).to.equal(1);
      expect(findDeleteModel).to.equal(null);
    });
  });

  describe('Associated model data', () => {
    it('Create a model with associated data using include', async () => {
      // TODO:
      // 1. create a restaurant with 3 foods.
      // 2. use model.create with include.
      // 3. use `fakeData.create` as restaurant data, use `data` as include foods.
      const data = [{
        name: 'big_macx1',
        price: 150,
      }, {
        name: 'big_macx2',
        price: 300,
      }, {
        name: 'big_macx3',
        price: 400,
      }];
      let restaurant = null;

      expect(restaurant.name).to.be.equal(fakeData.create.name);
      expect(restaurant.address).to.be.equal(fakeData.create.address);
      expect(restaurant.UserOrders.length).to.equal(data.length);
    });

    it('Create a model with associated data using set()', async () => {
      // TODO:
      // 1. create a restaurant and use set() method to set 1 associated model data.
      // 2. use model.findOne() with include to get model data with associated data.
      // 3. use data as food data, use `fakeData.create` as restaurant data.
      const data = {
        name: 'big_mac',
        price: 150,
      };
      let createdRest = null;
      let food = null;
      let findRestWithFood = null;

      expect(findRestWithFood.name).to.be.equal(fakeData.create.name);
      expect(findRestWithFood.address).to.be.equal(fakeData.create.address);
      expect(findRestWithFood.Foods.length).to.equal(1);
      expect(findRestWithFood.UserOrders[0].amount).to.equal(data.name);
      expect(findRestWithFood.UserOrders[0].remark).to.equal(data.price);
    });
  });
});
