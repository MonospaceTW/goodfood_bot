const express = require('express');
const leveldb = require('../../../leveldb');

const router = express.Router();

router.post('/', (req, res, next) => {
    const response = {};
    response.response_type = 'ephemeral';
    response.text = 'ok';
    if (req.body.text) {
        const i = Number(req.body.text);
        if (Number.isInteger(i)) {
            (async () => {
                let arr = await leveldb.get('order');
                arr = JSON.parse(arr);
                if (i < arr.list.length) {
                    const id = arr.list.splice(i, 1)[0];
                    await leveldb.put('order', JSON.stringify(arr));
                    await leveldb.del(`order/${id}`);
                    await leveldb.del(`order/${id}/store`);
                    await leveldb.del(`order/${id}/${req.body.user_id}`);
                    console.log(req.body.user_id);
                    res.send('dd');
                    res.end();
                } else {
                    res.end();
                }
            })().catch(() => {
                res.end();
            });
        } else {
            res.end();
        }
    } else {
        res.end();
    }
});

module.exports = router;
