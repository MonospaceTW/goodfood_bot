const express = require('express');
let { userAuthHandler, checkPermission } = require('../auth/user');

const router = express.Router();
const ExampleController = require('../controller/example');

this.exampleController = new ExampleController();

router.post('/admin/login', userAuthHandler);






module.exports = router;
