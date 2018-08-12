const express = require('express');
const router = express.Router();
const ExampleController = require('../controller/example');
const OauthController = require('../controller/oauth');

router.get('/', ExampleController.index);
router.get('/users', ExampleController.users);
router.get('/oauth', OauthController.auth);

module.exports = router;
