const express = require('express');
const addIn = require('../services/interact/firebase/addIn');
const chooseFood = require('../services/interact/firebase/chooseFood');
const buttonClick = require('../services/interact/firebase/buttonClick');
const addOrder = require('../services/interact/firebase/addOrder');

const router = express.Router();

router.post('/', async (req, res, next) => {
    const { payload } = JSON.parse(req.body);
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
});

module.exports = router;
