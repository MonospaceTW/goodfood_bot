'use strict';

const SPEC_MODEL_NAME = 'Restaurant';
const fakeData = {
  create: {
    name: faker.name.findName(),
    address: faker.address.streetAddress(),
    imageUrl: faker.image.image(),
    orderInUnit: faker.lorem.word(),
    orderRequirement: faker.random.number(),
    phone: faker.phone.phoneNumberFormat(),
    startTime: faker.date.recent(),
    endTime: faker.date.future(),
    remark: faker.lorem.sentences(),
  },
  create2: {
    name: faker.name.findName(),
    address: faker.address.streetAddress(),
    imageUrl: faker.image.image(),
    orderInUnit: faker.lorem.word(),
    orderRequirement: faker.random.number(),
    phone: faker.phone.phoneNumberFormat(),
    startTime: faker.date.recent(),
    endTime: faker.date.future(),
    remark: faker.lorem.sentences(),
  },
  create3: {
    name: faker.name.findName(),
    address: faker.address.streetAddress(),
    imageUrl: faker.image.image(),
    orderInUnit: faker.lorem.word(),
    orderRequirement: faker.random.number(),
    phone: faker.phone.phoneNumberFormat(),
    startTime: faker.date.recent(),
    endTime: faker.date.future(),
    remark: faker.lorem.sentences(),
  },
  update: {
    name: faker.name.findName(),
    address: faker.address.streetAddress(),
    imageUrl: faker.image.image(),
    orderInUnit: faker.lorem.word(),
    orderRequirement: faker.random.number(),
    phone: faker.phone.phoneNumberFormat(),
    startTime: faker.date.recent(),
    endTime: faker.date.future(),
    remark: faker.lorem.sentences(),
  },
  updateNewData: {
    name: faker.name.findName(),
    address: faker.address.streetAddress(),
    imageUrl: faker.image.image(),
    orderInUnit: faker.lorem.word(),
    orderRequirement: faker.random.number(),
    phone: faker.phone.phoneNumberFormat(),
    startTime: faker.date.recent(),
    endTime: faker.date.future(),
    remark: faker.lorem.sentences(),
  },
  updateNewData2: {
    name: faker.name.findName(),
    address: faker.address.streetAddress(),
    imageUrl: faker.image.image(),
    orderInUnit: faker.lorem.word(),
    orderRequirement: faker.random.number(),
    phone: faker.phone.phoneNumberFormat(),
    startTime: faker.date.recent(),
    endTime: faker.date.future(),
    remark: faker.lorem.sentences(),
  },
  findOne: {
    name: 'keyword',
    address: faker.address.streetAddress(),
    imageUrl: faker.image.image(),
    orderInUnit: faker.lorem.word(),
    orderRequirement: faker.random.number(),
    phone: faker.phone.phoneNumberFormat(),
    startTime: faker.date.recent(),
    endTime: faker.date.future(),
    remark: faker.lorem.sentences(),
  },
  findAll: [
    {
      name: 'keyword',
      address: faker.address.streetAddress(),
      imageUrl: faker.image.image(),
      orderInUnit: faker.lorem.word(),
      orderRequirement: faker.random.number(),
      phone: faker.phone.phoneNumberFormat(),
      startTime: faker.date.recent(),
      endTime: faker.date.future(),
      remark: faker.lorem.sentences(),
    },
    {
      name: 'keyword',
      address: faker.address.streetAddress(),
      imageUrl: faker.image.image(),
      orderInUnit: faker.lorem.word(),
      orderRequirement: faker.random.number(),
      phone: faker.phone.phoneNumberFormat(),
      startTime: faker.date.recent(),
      endTime: faker.date.future(),
      remark: faker.lorem.sentences(),
    },
    {
      name: 'keyword',
      address: faker.address.streetAddress(),
      imageUrl: faker.image.image(),
      orderInUnit: faker.lorem.word(),
      orderRequirement: faker.random.number(),
      phone: faker.phone.phoneNumberFormat(),
      startTime: faker.date.recent(),
      endTime: faker.date.future(),
      remark: faker.lorem.sentences(),
    },
  ],
  destroy: {
    name: faker.name.findName(),
    address: faker.address.streetAddress(),
    imageUrl: faker.image.image(),
    orderInUnit: faker.lorem.word(),
    orderRequirement: faker.random.number(),
    phone: faker.phone.phoneNumberFormat(),
    startTime: faker.date.recent(),
    endTime: faker.date.future(),
    remark: faker.lorem.sentences(),
  },
  keyword: {
    name: 'keyword',
  },
};

describe(`models/${SPEC_MODEL_NAME}`, () => {
  before(() => {
  });

  beforeEach(() => {
  });

  describe('Create model data', () => {
    it('creates a data', async () => {
      // TODO:
      // 1. model.create(fakeData.create)...
      // 2. use data from `fakeData.create`
      const createdModel = await models[SPEC_MODEL_NAME].create(fakeData.create);

      Object.keys(fakeData.create).forEach(e => {
        expect(createdModel[e]).to.equal(fakeData.create[e]);
      });
    });
  });

  describe('Update model data', () => {
    let modelDataForUpdate = null;
    before(async () => {
      // create a model data before run test
      modelDataForUpdate = await models[SPEC_MODEL_NAME].create(fakeData.update);
    });

    it('update a model with find and save', async () => {
      // TODO:
      // 1. use model.find(modelId === updatedModel.id) then model.save();
      // 2. use data from `fakeData.updateNewData`
      // 3. use `findAndUpdatedModelData` as target, `modelDataForUpdate.id` as condition.
      let findAndUpdatedModelData = await models[SPEC_MODEL_NAME].find({
        where: {
          id: modelDataForUpdate.id,
        }
      });
      findAndUpdatedModelData.name = fakeData.updateNewData.name;
      findAndUpdatedModelData.address = fakeData.updateNewData.address;
      findAndUpdatedModelData.imageUrl = fakeData.updateNewData.imageUrl;
      findAndUpdatedModelData.orderInUnit = fakeData.updateNewData.orderInUnit;
      findAndUpdatedModelData.orderRequirement = fakeData.updateNewData.orderRequirement;
      findAndUpdatedModelData.phone = fakeData.updateNewData.phone;
      findAndUpdatedModelData.startTime = fakeData.updateNewData.startTime;
      findAndUpdatedModelData.endTime = fakeData.updateNewData.endTime;
      findAndUpdatedModelData.remark = fakeData.updateNewData.remark;
      await findAndUpdatedModelData.save();

      Object.keys(fakeData.updateNewData).forEach(e => {
        expect(findAndUpdatedModelData[e]).to.equal(fakeData.updateNewData[e]);
      });
    });

    it('update a model with update method', async () => {
      // TODO:
      // 1. use model.update()...
      // 2. use data from `fakeData.updateNewData2`
      // 3. use `updateModelData` as target, `modelDataForUpdate.id` as condition.
      const updateModelData = await modelDataForUpdate.update(fakeData.updateNewData2, {
        where: {
          id: modelDataForUpdate.id,
        }
      });

      Object.keys(fakeData.updateNewData2).forEach(e => {
        expect(updateModelData[e]).to.equal(fakeData.updateNewData2[e]);
      });
    });
  });

  describe('Find one model data', () => {
    let modelDateForFind = null;
    before(async () => {
      // create a model before run test
      modelDateForFind = await models[SPEC_MODEL_NAME].create(fakeData.findOne);
    });

    it('find a model with findOne', async () => {
      // TODO:
      // 1. use model.findOne...
      // 2. use data from `fakeData.findOne`
      // 3. use `findModelData` as target, `modelDateForFind.id` as option.
      const findModelData = await models[SPEC_MODEL_NAME].findOne({
        where: {
          id: modelDateForFind.id,
        }
      });

      Object.keys(fakeData.findOne).forEach(e => {
        expect(findModelData[e]).to.eql(fakeData.findOne[e]);
      });
    });
  });

  describe('Find all model data', () => {
    before(async () => {
      // create 3 models and push into models array.
      // await models[SPEC_MODEL_NAME].create(data1);
      await models[SPEC_MODEL_NAME].bulkCreate(fakeData.findAll);
    });

    it('find all model', async () => {
      // TODO:
      // 1. use model.findAll...
      // 2. use data from `fakeData.findAll`
      // 3. use `findAllModelData` as target.
      const findAllModelData = await models[SPEC_MODEL_NAME].findAll();

      expect(findAllModelData.length).to.greaterThan(fakeData.findAll.length - 1);
    });

    it('find all with where', async () => {
      // TODO:
      // 1. use model.findAll...
      // 2. use data from `fakeData.findAll`
      // 3. use `findAllModelData` as target, and use `fakeData.keyword` as option.
      const findAllModelData = await models[SPEC_MODEL_NAME].findAll({
        where: {
          name: fakeData.keyword.name,
        }
      });
      // console.log('findAllModelData=>', findAllModelData);

      expect(findAllModelData.length).to.greaterThan(fakeData.findAll.length - 1);
      for (const index in findAllModelData) {
        expect(findAllModelData[index].name).to.equal(fakeData.findAll[0].name);
      }
    });
  });

  describe('Destroy model data', () => {
    let modelDataForDestroy = null;
    before(async () => {
      // create data before run test
      modelDataForDestroy = await models[SPEC_MODEL_NAME].create(fakeData.destroy);
    });

    it('delete a model data with where', async () => {
      // TODO:
      // 1. use model.destroy...
      // 2. use data from `fakeData.findAll`
      // 3. use `findAllModelData` as target, and use `modelDataForDestroy.id` as option.
      const deleteModelData = await models[SPEC_MODEL_NAME].destroy({
        where: {
          id: modelDataForDestroy.id,
        }
      });

      const findDeleteModelData = await models[SPEC_MODEL_NAME].find({
        where: {
          id: modelDataForDestroy.id,
        }
      });

      expect(deleteModelData).to.equal(1);
      expect(findDeleteModelData).to.equal(null);
    });
  });

  describe('Associated model data', () => {
    it('Create a model with associated data using include', async () => {
      // TODO:
      // 1. create a restaurant with 3 foods.
      // 2. use model.create with include.
      // 3. use `fakeData.create2` as restaurant data, use `data` as include foods.
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

      const restaurant = await models[SPEC_MODEL_NAME].create({
        ...fakeData.create2,
        Food: data,
      }, {
        include: [{
          model: models.Food,
        }]
      });

      expect(restaurant.name).to.be.equal(fakeData.create2.name);
      expect(restaurant.address).to.be.equal(fakeData.create2.address);
      expect(restaurant.Food.length).to.equal(data.length);
    });

    it('Create a model with associated data using set()', async () => {
      // TODO:
      // 1. create a restaurant and use set() method to set 1 associated model data.
      // 2. use model.findOne() with include to get model data with associated data.
      // 3. use data as food data, use `fakeData.create3` as restaurant data.
      const data = {
        name: 'big_mac',
        price: 150,
      };
      let createdRestaurant = await models[SPEC_MODEL_NAME].create({
        ...fakeData.create3,
        Food: data,
      }, {
        include: [{
          model: models.Food,
        }]
      });
      const food = await models.Food.create(data);
      await createdRestaurant.setFood(food);

      const findRestaurantWithFood = await models[SPEC_MODEL_NAME].findOne({
        where: {
          name: fakeData.create3.name,
        },
        include: [models.Food],
      });

      expect(findRestaurantWithFood.name).to.be.equal(fakeData.create3.name);
      expect(findRestaurantWithFood.address).to.be.equal(fakeData.create3.address);
      expect(findRestaurantWithFood.Food.length).to.equal(1);
      expect(findRestaurantWithFood.Food[0].name).to.equal(data.name);
      expect(findRestaurantWithFood.Food[0].price).to.equal(data.price);
    });
  });
});
