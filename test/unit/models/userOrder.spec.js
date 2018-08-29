'use strict';

const SPEC_MODEL_NAME = 'UserOrder';
const fakeData = {
  create: {
    price: faker.random.number(),
    amount: faker.random.number(),
    subTotal: faker.random.number(),
    remark: faker.lorem.words(),

  },
  create2: {
    price: faker.random.number(),
    amount: faker.random.number(),
    subTotal: faker.random.number(),
    remark: faker.lorem.words(),
  },
  update: {
    price: faker.random.number(),
    amount: faker.random.number(),
    subTotal: faker.random.number(),
    remark: faker.lorem.words(),
  },
  updateNewData: {
    price: faker.random.number(),
    amount: faker.random.number(),
    subTotal: faker.random.number(),
    remark: faker.lorem.words(),
  },
  updateNewData2: {
    price: faker.random.number(),
    amount: faker.random.number(),
    subTotal: faker.random.number(),
    remark: faker.lorem.words(),
  },
  findOne: {
    price: faker.random.number(),
    amount: faker.random.number(),
    subTotal: faker.random.number(),
    remark: faker.lorem.words(),
  },
  findAll: [
    {
      amount: 10,
      price: faker.random.number(),
      subTotal: faker.random.number(),
      remark: faker.lorem.words(),
    },
    {
      amount: 10,
      price: faker.random.number(),
      subTotal: faker.random.number(),
      remark: faker.lorem.words(),
    },
    {
      amount: 10,
      price: faker.random.number(),
      subTotal: faker.random.number(),
      remark: faker.lorem.words(),
    },
  ],
  destroy: {
    price: faker.random.number(),
    amount: faker.random.number(),
    subTotal: faker.random.number(),
    remark: faker.lorem.words(),
  },
  keyword: {
    amount: 10,
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
      const createdModelData = await models[SPEC_MODEL_NAME].create(fakeData.create);

      Object.keys(fakeData.create).forEach(e => {
        expect(createdModelData[e]).to.equal(fakeData.create[e]);
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
      try {
        let findAndUpdatedModelData = await models[SPEC_MODEL_NAME].find({
          where: {
            id: modelDataForUpdate.id,
          }
        });
        if (findAndUpdatedModelData) {
          findAndUpdatedModelData.price = fakeData.updateNewData.price;
          findAndUpdatedModelData.amount = fakeData.updateNewData.amount;
          findAndUpdatedModelData.subTotal = fakeData.updateNewData.subTotal;
          findAndUpdatedModelData.remark = fakeData.updateNewData.remark;
          await findAndUpdatedModelData.save();
          Object.keys(fakeData.updateNewData).forEach(e => {
            expect(findAndUpdatedModelData[e]).to.equal(fakeData.updateNewData[e]);
          });
        }
      } catch (error) {
        console.error('Error message:', error);
      }
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
        expect(findModelData[e]).to.equal(fakeData.findOne[e]);
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
        where: fakeData.keyword
      });

      expect(findAllModelData.length).to.greaterThan(fakeData.findAll.length - 1);
      for (const index in findAllModelData) {
        expect(findAllModelData[index].amount).to.equal(fakeData.findAll[0].amount);
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
      // 1. create a User with 3 UserOrders.
      // 2. use model.create with include.
      // 3. use data as user data, use `fakeData.findAll` as include UserOrders.
      const userData = {
        nickName: 'Associated',
        email: 'a@b.c',
      };
      const user = await models.User.create({
        ...userData,
        UserOrders: fakeData.findAll
      }, {
        include: [{
          model: models.UserOrder,
        }],
      });

      expect(user.nickName).to.be.equal(userData.nickName);
      expect(user.email).to.be.equal(userData.email);
      expect(user.UserOrders.length).to.equal(3);
    });

    it('Create a model with associated data using set()', async () => {
      // TODO:
      // 1. create a User and use set() method to set 1 associated model data.
      // 2. use model.findOne() with include to get model data with associated data.
      // 3. use data as User data, use `fakeData.create2` as associated model data.
      const data = {
        nickName: 'Associated',
        email: 'aa@b.c',
      };
      const createdUser = await models.User.create({
        ...data,
        UserOrders: fakeData.create2,
      }, {
        include: [{
          model: models.UserOrder,
        }]
      });

      const userOrder = await models[SPEC_MODEL_NAME].create(fakeData.create2);
      // console.log('userOrder=>', userOrder);
      await createdUser.setUserOrders(userOrder);
      const findUserWithAssociatedData = await models.User.findOne({
        where: data,
        include: [models.UserOrder],
      });

      expect(findUserWithAssociatedData.nickName).to.be.equal(data.nickName);
      expect(findUserWithAssociatedData.email).to.be.equal(data.email);
      expect(findUserWithAssociatedData.UserOrders.length).to.equal(1);
      expect(findUserWithAssociatedData.UserOrders[0].amount).to.equal(fakeData.create2.amount);
      expect(findUserWithAssociatedData.UserOrders[0].remark).to.equal(fakeData.create2.remark);
    });
  });
});
