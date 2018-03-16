const express = require('express');

const cheese = require('./commands/cheese');
const bind = require('./commands/bind');
const unbind = require('./commands/unbind');
const issue = require('./commands/issue');
const displaydb = require('./commands/displaydb');
const deletedb = require('./commands/deletedb');
const icact = require('./interactive-components/icact');
const mmenu = require('./interactive-components/mmenu');

const router = express.Router();

// interactive-components
router.use('/interactive-components', icact);
router.use('/message-menus', mmenu);

// command
router.use('/cheese', cheese);
router.use('/bind', bind);
router.use('/unbind', unbind);
router.use('/issue', issue);
router.use('/displaydb', displaydb);
router.use('/deletedb', deletedb);

module.exports = router;
