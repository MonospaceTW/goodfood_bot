const express = require('express');
const leveldb = require('../../leveldb');

const router = express.Router();

router.post('/', (req, res, next) => {
    const response = {};
    response.response_type = 'ephemeral';
    response.text = 'ok';
    leveldb.del('order').then((err) => {
        res.end();
    });
});

module.exports = router;
