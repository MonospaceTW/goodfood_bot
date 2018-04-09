const express = require('express');

const cheese = require('./commands/firebase/cheese');
const displaydb = require('./commands/firebase/displaydb');
const deletedb = require('./commands/firebase/deletedb');
const sauth = require('./slackauth');
const github = require('./commands/github');
const echo = require('./commands/echo');

const interact = require('./interact');

const router = express.Router();

// interactive-components
router.use('/interact', interact);

// block command outside slack
router.use(/.+/, sauth);

// command
router.use('/cheese', cheese);
router.use('/displaydb', displaydb);
router.use('/deletedb', deletedb);
router.use('/github', github);
router.use('/echo', echo);


module.exports = router;
