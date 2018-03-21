const express = require('express');

const cheese = require('./commands/cheese');
const bind = require('./commands/bind');
const unbind = require('./commands/unbind');
const displaydb = require('./commands/displaydb');
const deletedb = require('./commands/deletedb');
const icact = require('./interactive-components/icact');
const mmenu = require('./interactive-components/mmenu');
const sauth = require('./slackauth');

const router = express.Router();

// interactive-components
router.use('/interactive-components', icact);
router.use('/message-menus', mmenu);

// block command outside slack
router.use('/', sauth);

// command
router.use('/cheese', cheese);
router.use('/bind', bind);
router.use('/unbind', unbind);
router.use('/displaydb', displaydb);
router.use('/deletedb', deletedb);

module.exports = router;
