const express = require('express');
const SLACK = require('../config/slack.json');

const token = SLACK.VERIFICATION_TOKEN;

const router = express.Router();

router.post('/', (req, res, next) => {
    if (req.body.token === token) {
        next();
    } else {
        res.end();
    }
});

module.exports = router;
