'use strict';

const modelName = 'Passport';
const fakeData = {
  create: {
    token: faker.name.findName(),
    workspaceName: faker.name.findName(),
    passwordHash: faker.internet.password(),
  },
  update: {
    token: faker.name.findName(),
    workspaceName: faker.name.findName(),
    passwordHash: faker.internet.password(),
  },
  updateNewData: {
    token: faker.name.findName(),
    workspaceName: faker.name.findName(),
    passwordHash: faker.internet.password(),
  },
  updateNewData2: {
    token: faker.name.findName(),
    workspaceName: faker.name.findName(),
    passwordHash: faker.internet.password(),
  },
  findOne: {
    token: 'faker.name.findName()',
    workspaceName: faker.name.findName(),
    passwordHash: faker.internet.password(),
  },
  findAll: [
    {
      token: 'faker.name.findName()',
      workspaceName: faker.name.findName(),
      passwordHash: faker.internet.password(),
    },
    {
      token: 'faker.name.findName()',
      workspaceName: faker.name.findName(),
      passwordHash: faker.internet.password(),
    },
    {
      token: 'faker.name.findName()',
      workspaceName: faker.name.findName(),
      passwordHash: faker.internet.password(),
    },
  ],
  destroy: {
    token: faker.name.findName(),
    workspaceName: faker.name.findName(),
    passwordHash: faker.internet.password(),
  },
  keyword: {
    token: 'faker.name.findName()',
  },
};

describe(`models/${modelName}`, () => {
  before(() => {
  });

  beforeEach(() => {
  });

  describe('Create model data', () => {
    it('creates a data', async () => {
      // TODO:
      // 1. model.create(fakeData.create)...
      // 2. use data from `fakeData.create`
      let createdModel = await models[modelName].create(fakeData.create);

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
      try {
        let findAndUpdatedModel = await models[modelName].findOne({
          where: {
            id: modelDataForUpdate.id,
          },
        });

        if (findAndUpdatedModel) {
          findAndUpdatedModel.token = fakeData.updateNewData.token;
          findAndUpdatedModel.workspaceName =
            fakeData.updateNewData.workspaceName;
          findAndUpdatedModel.passwordHash =
            fakeData.updateNewData.passwordHash;

          await findAndUpdatedModel.save();

          Object.keys(fakeData.updateNewData).forEach(e => {
            expect(findAndUpdatedModel[e]).to.equal(fakeData.updateNewData[e]);
          });
        }
      } catch (error) {
        console.log('find and save => ', error);
      }
    });

    it('update a model with update method', async () => {
      // TODO:
      // 1. use model.update()...
      // 2. use data from `fakeData.updateNewData2`
      // 3. use `updateModel` as target, `modelDataForUpdate.id` as condition.
      try {
        await models[modelName].update(fakeData.updateNewData2, {
          where: {
            id: modelDataForUpdate.id,
          },
        });

        let updateModel = await models[modelName].findOne({
          where: {
            id: modelDataForUpdate.id,
          },
        });

        Object.keys(fakeData.updateNewData2).forEach(e => {
          expect(updateModel[e]).to.equal(fakeData.updateNewData2[e]);
        });
      } catch (error) {
        console.log('update => ', error);
      }
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
      let findModel = await models[modelName].findOne({
        where: {
          id: modelDateForFind.id,
        },
      });

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
      let findAllModel = await models[modelName].findAll();

      expect(findAllModel.length).to.greaterThan(fakeData.findAll.length - 1);
    });

    it('find all with where', async () => {
      // TODO:
      // 1. use model.findAll...
      // 2. use data from `fakeData.findAll`
      // 3. use `findAllModel` as target, and use `fakeData.keyword` as option.
      let findAllModel = await models[modelName].findAll({
        where: fakeData.keyword,
      });

      expect(findAllModel.length).to.greaterThan(fakeData.findAll.length - 1);
      fakeData.findAll.forEach(i => {
        Object.keys(i).forEach(e => {
          expect(findAllModel[e]).to.equal(fakeData.findAll[e]);
        });
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
      let deleteModel = await models[modelName].destroy({
        where: {
          id: modelDataForDestroy.id,
        },
      });
      let findDeleteModel = await models[modelName].findOne({
        where: {
          id: modelDataForDestroy.id,
        },
      });
      expect(deleteModel).to.equal(1);
      expect(findDeleteModel).to.equal(null);
    });
  });
});
