'use strict';

const SPEC_MODEL_NAME = 'User';
const fakeData = {
  create: {
    nickName: faker.name.findName(),
    email: faker.internet.email(),
  },
  create2: {
    nickName: faker.name.findName(),
    email: faker.internet.email(),
  },
  create3: {
    nickName: faker.name.findName(),
    email: faker.internet.email(),
  },
  update: {
    nickName: faker.name.findName(),
    email: faker.internet.email(),
  },
  updateNewData: {
    nickName: faker.name.findName(),
    email: faker.internet.email(),
  },
  updateNewData2: {
    nickName: faker.name.findName(),
    email: faker.internet.email(),
  },
  findOne: {
    nickName: 'faker.name.findName()',
    email: faker.internet.email(),
  },
  findAll: [
    {
      nickName: 'faker.name.findName()',
      email: faker.internet.email(),
    },
    {
      nickName: 'faker.name.findName()',
      email: faker.internet.email(),
    },
    {
      nickName: 'faker.name.findName()',
      email: faker.internet.email(),
    },
  ],
  destroy: {
    nickName: faker.name.findName(),
    email: faker.internet.email(),
  },
  keyword: {
    nickName: 'faker.name.findName()',
  },
};

describe.only(`models/${SPEC_MODEL_NAME}`, () => {
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
      // 3. use `findAndUpdatedModel` as target, `modelDataForUpdate.id` as condition.
      let findAndUpdatedModelData = await models[SPEC_MODEL_NAME].findOne({
        where: {
          id: modelDataForUpdate.id
        }
      });
      findAndUpdatedModelData.nickName = fakeData.updateNewData.nickName;
      findAndUpdatedModelData.email = fakeData.updateNewData.email;
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
    let modelDataForFind = null;
    before(async () => {
      // create a model before run test
      modelDataForFind = await models[SPEC_MODEL_NAME].create(fakeData.findOne);
    });

    it('find a model with findOne', async () => {
      // TODO:
      // 1. use model.findOne...
      // 2. use data from `fakeData.findOne`
      // 3. use `findModelData` as target, `modelDataForFind.id` as option.
      const findModelData = await models[SPEC_MODEL_NAME].findOne({
        where: {
          id: modelDataForFind.id
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
          nickName: fakeData.keyword.nickName
        }
      });

      expect(findAllModelData.length).to.greaterThan(fakeData.findAll.length - 1);
      fakeData.findAll.forEach(i => {
        Object.keys(i).forEach(e => {
          // console.log('fakeData.findAll[e]=>', fakeData.findAll[e]);
          expect(findAllModelData[e]).to.equal(fakeData.findAll[e]);
        });
      });
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
      // 3. use `deleteModelData` as target, and use `modelDataForDestroy.id` as option.
      const deleteModelData = await models[SPEC_MODEL_NAME].destroy({
        where: {
          id: modelDataForDestroy.id
        }
      });

      const findDeletedModel = await models[SPEC_MODEL_NAME].findOne({
        where: {
          id: modelDataForDestroy.id
        }
      });

      expect(deleteModelData).to.equal(1);
      expect(findDeletedModel).to.equal(null);
    });
  });

  describe('Associated model data', () => {
    it('Create a model with associated data using include', async () => {
      // TODO:
      // 1. create a User with 3 passports.
      // 2. use model.create with include.
      // 3. use data as Passport data, use `fakeData.create2` as user data.
      const data = [{
        token: '1',
        workspaceName: 'ws1',
        passwordHash: 'ws1ws1ws1',
      }, {
        token: '2',
        workspaceName: 'ws2',
        passwordHash: 'ws2ws2ws2',
      }, {
        token: '3',
        workspaceName: 'ws3',
        passwordHash: 'ws3ws3ws3',
      }];

      const user = await models[SPEC_MODEL_NAME].create({
        ...fakeData.create2,
        Passports: data
      }, {
        include: [models.Passport]
      });

      expect(user.nickName).to.be.equal(fakeData.create2.nickName);
      expect(user.email).to.be.equal(fakeData.create2.email);
      expect(user.Passports.length).to.equal(data.length);
    });

    it('Create a model with associated data using set()', async () => {
      // TODO:
      // 1. create a User and use set() method to set 1 associated model data.
      // 2. use model.findOne() with include to get model data with associated data.
      // 3. use data as Passport data, use `fakeData.create3` as user data.
      const data = {
        token: '1',
        workspaceName: 'ws1',
        passwordHash: 'ws1ws1ws1',
      };

      let user = await models[SPEC_MODEL_NAME].create({
        ...fakeData.create3,
        Passports: data
      }, {
        include: [models.Passport]
      });

      const passport = await models.Passport.create(data);
      await user.setPassports(passport);

      const userWithPassport = await models[SPEC_MODEL_NAME].findOne(
        {
          where: {
            nickName: fakeData.create3.nickName
          },
          include: [models.Passport],

        }
      );

      expect(userWithPassport.nickName).to.be.equal(fakeData.create3.nickName);
      expect(userWithPassport.email).to.be.equal(fakeData.create3.email);
      expect(userWithPassport.Passports.length).to.equal(1);
      expect(userWithPassport.Passports[0].token).to.equal(data.token);
      expect(userWithPassport.Passports[0].workspaceName).to.equal(data.workspaceName);
      expect(userWithPassport.Passports[0].passwordHash).to.equal(data.passwordHash);
    });
  });
});
