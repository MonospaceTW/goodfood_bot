const express = require('express');
const firebase = require('./firebase');
const github = require('./github');

const router = express.Router();

router.use('/firebase', firebase);
router.use('/github', github);

module.exports = router;
