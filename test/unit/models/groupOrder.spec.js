'use strict';

const SPEC_MODEL_NAME = 'GroupOrder';
const fakeData = {
  create: {
    total: faker.random.number(),
  },
  update: {
    total: faker.random.number(),
  },
  updateNewData: {
    total: faker.random.number(),
  },
  updateNewData2: {
    total: faker.random.number(),
  },
  findOne: {
    total: 'faker.name.findName()',
  },
  findAll: [
    {
      total: 'faker.name.findName()',
    },
    {
      total: 'faker.name.findName()',
    },
    {
      total: 'faker.name.findName()',
    },
  ],
  destroy: {
    total: faker.random.number(),
  },
  keyword: {
    total: 'faker.name.findName()',
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
      let findAndUpdatedModelData = await models[SPEC_MODEL_NAME].find({
        where: {
          id: modelDataForUpdate.id
        }
      });
      findAndUpdatedModelData.total = fakeData.updateNewData.total;
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
          id: modelDataForUpdate.id
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
          id: modelDateForFind.id
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
        where: {
          total: fakeData.keyword.total
        }
      });

      expect(findAllModelData.length).to.greaterThan(fakeData.findAll.length - 1);
      for (const index in findAllModelData) {
        expect(findAllModelData[index].total).to.equal(fakeData.findAll[0].total);
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
          id: modelDataForDestroy.id
        }
      });

      const findDeleteModelData = await models[SPEC_MODEL_NAME].findOne({
        where: {
          id: modelDataForDestroy.id
        }
      });

      expect(deleteModelData).to.equal(1);
      expect(findDeleteModelData).to.equal(null);
    });
  });
});
