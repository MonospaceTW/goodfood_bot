global.models = require('../models');

// do something before start testing.
before((done) => {
  console.log('models=>', models);
  done();
});
