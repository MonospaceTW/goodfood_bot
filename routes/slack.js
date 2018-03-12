const express = require('express');

const cheese = require('./commands/cheese');
const bind = require('./commands/bind');
const unbind = require('./commands/unbind');
const issue = require('./commands/issue');

const router = express.Router();

router.use('/cheese', cheese);
router.use('/bind', bind);
router.use('/unbind', unbind);
router.use('/issue', issue);

module.exports = router;
