const express = require('express');
const github = require('./github');

const router = express.Router();

router.use('/github', github);

module.exports = router;
