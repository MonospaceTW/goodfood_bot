const express = require('express');

const cheese = require('./commands/cheese');
const github = require('./commands/github');
const echo = require('./commands/echo');

const interact = require('./interact');

const router = express.Router();

router.use('/interact', interact);

router.use('/cheese', cheese);
router.use('/github', github);
router.use('/echo', echo);


module.exports = router;
