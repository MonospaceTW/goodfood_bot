const express = require('express');
const leveldb = require('../../leveldb');

const router = express.Router();

router.post('/', async (req, res, next) => {
    const response = {};
    response.response_type = 'ephemeral';

    if (req.body.text) {
        try {
            const orderName = await leveldb.get(`order/${req.body.text}/store`);
            const orderList = await leveldb.get(`order/${req.body.text}/${req.body.user_id}`);

            res.send(orderName.toString('utf8') + orderList.toString('utf8'));
        } catch (err) {
            res.send('nothing');
        }
        res.end();
    } else {
        leveldb.get('order', (err, value) => {
            if (!err) {
                res.send(value.toString('utf8'));
            }
            res.end();
        });
    }
});

module.exports = router;
