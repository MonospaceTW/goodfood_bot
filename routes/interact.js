const express = require('express');
const addIn = require('../services/interact/firebase/addIn');
const chooseFood = require('../services/interact/firebase/chooseFood');
const buttonClick = require('../services/interact/firebase/buttonClick');
const addOrder = require('../services/interact/firebase/addOrder');
const disconnect = require('../services/interact/github/disconnect');
const submit_issue = require('../services/interact/github/submit_issue');

const router = express.Router();

router.post('/', async (req, res) => {
    const payload = JSON.parse(req.body.payload);
    const callbacks = payload.callback_id.split('/');

    if (callbacks[0] === 'add_in') {
        await addIn(payload, res);
    }

    // food option
    if (callbacks[0] === 'choose_food') {
        await chooseFood(payload, res);
    }

    // button_click happen
    if (callbacks[0] === 'button_click') {
        await buttonClick(payload, res);
    }

    // add order happen
    if (callbacks[0] === 'add_order') {
        await addOrder(payload, res);
    }

    if (callbacks[0] === 'disconnect') {
        await disconnect(payload, res);
    }

    if (callbacks[0] === 'submit-issue') {
        await submit_issue(payload, res);
    }
});

module.exports = router;
