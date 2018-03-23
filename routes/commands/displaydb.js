const express = require('express');
const leveldb = require('../../leveldb');

const router = express.Router();

router.post('/', (req, res, next) => {
    const response = {};
    response.response_type = 'ephemeral';

    leveldb.get('order', (err, value) => {
        if (!err) {
            res.send(value.toString('utf8'));
        }
        res.end();
    });
});

module.exports = router;
