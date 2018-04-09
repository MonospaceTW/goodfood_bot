const express = require('express');
const firebase = require('./firebase');

const router = express.Router();

router.use('/firebase', firebase);

module.exports = router;
