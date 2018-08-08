global.models = require('../models');

// do something before start testing.
before(async () => {
  await models.sequelize.sync();
  console.log('models=>', models);
});
