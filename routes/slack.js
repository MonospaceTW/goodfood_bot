const express = require('express');

const cheese = require('./commands/cheese');
const bind = require('./commands/bind');
const unbind = require('./commands/unbind');
const github = require('./commands/github');
const echo = require('./commands/echo');

const router = express.Router();

router.use('/cheese', cheese);
router.use('/bind', bind);
router.use('/unbind', unbind);
router.use('/github', github);
router.use('/echo', echo);

module.exports = router;
