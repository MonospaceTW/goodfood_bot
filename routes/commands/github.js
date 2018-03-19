const express = require('express');

const connect = require('./github/connect');
const disconnect = require('./github/disconnect');
const issue = require('./github/issue');

const router = express.Router();

router.use('/connect', connect);
router.use('/disconnect', disconnect);
router.use('/issue', issue);

module.exports = router;
