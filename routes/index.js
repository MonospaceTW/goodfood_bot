const express = require('express');
const router = express.Router();
const ExampleController = require('../controller/example');

this.exampleController = new ExampleController();

router.get('/', this.exampleController.index);
router.get('/users', this.exampleController.users);

module.exports = router;
