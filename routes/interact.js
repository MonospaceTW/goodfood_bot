const express = require('express');

const disconnect = require('../services/interact/github/disconnect');
const submit_issue = require('../services/interact/github/submit_issue');

const router = express.Router();

router.post('/', async (req, res) => {
    const payload = JSON.parse(req.body.payload);
    const callbacks = payload.callback_id.split('/');

    if (callbacks[0] === 'disconnect') {
        await disconnect(payload, res);
    }

    if (callbacks[0] === 'submit-issue') {
        await submit_issue(payload, res);
    }
});

module.exports = router;
