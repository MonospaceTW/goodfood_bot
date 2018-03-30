const express = require('express');
const leveldb = require('../../leveldb');

const router = express.Router();

router.post('/', (req, res, next) => {
    const response = {};
    response.response_type = 'ephemeral';

    if (req.body.text) {
        leveldb.get(`order/${req.body.text}`, (err, value) => {
            if (!err) {
                res.send(value.toString('utf8'));
            } else {
                res.send('nothing');
            }
            res.end();
        });
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
