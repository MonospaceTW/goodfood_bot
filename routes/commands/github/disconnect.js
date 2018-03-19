const express = require('express');
const leveldb = require('../../../leveldb');

const router = express.Router();

router.post('/', (req, res) => {
    const { user_id } = req.body;
    leveldb.del(`${user_id}_token`)
        .then(() => {
            res.json({
                response_type: 'ephemeral',
                text: ':disappointed: You have disconnected.',
            });
        }).catch((err) => {
            res.status(500).end(err);
        });
});

module.exports = router;
