const express = require('express');

const cheese = require('./commands/firebase/cheese');
const displaydb = require('./commands/firebase/displaydb');
const deletedb = require('./commands/firebase/deletedb');
const icact = require('./interact');
const mmenu = require('./interact/mmenu');
const sauth = require('./slackauth');

const router = express.Router();

// interactive-components
router.use('/interact', icact);
router.use('/message-menus', mmenu);

// block command outside slack
router.use(/.+/, sauth);

// command
router.use('/cheese', cheese);
router.use('/displaydb', displaydb);
router.use('/deletedb', deletedb);

module.exports = router;
