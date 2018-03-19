const express = require('express');
const CONFIG_SLACK = require('../config/slack.json');

const cheese = require('./commands/cheese');
const bind = require('./commands/bind');
const unbind = require('./commands/unbind');
const github = require('./commands/github');
const echo = require('./commands/echo');

const interact = require('./interact');

const router = express.Router();

const checkToken = (req, res, next) => {
    if (req.body.token !== CONFIG_SLACK.VERIFICATION_TOKEN) {
        res.status(403).end('Access Forbidden');
    } else {
        next();
    }
};

router.use('/interact', interact);

router.use(checkToken);

router.use('/cheese', cheese);
router.use('/bind', bind);
router.use('/unbind', unbind);
router.use('/github', github);
router.use('/echo', echo);


module.exports = router;
