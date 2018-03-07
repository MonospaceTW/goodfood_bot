const express = require('express');
const SqliteDb = require('../sqlite/sqlitedb');

const router = express.Router();
const db = new SqliteDb();

router.post('/', (req, res, next) => {
    const response = {};
    response.response_type = 'ephemeral';
    // check if send from slack
    if (req.body.token === 'S3Kizw5s0LYgspz80RutJFxH') {
        const row = db.read('SELECT goodfood FROM Bind WHERE slack = ?', `${req.body.user_name}`);
        row.then((col) => {
            if (col.length === 0) {
                response.text = '此帳號尚未做綁定';
            } else {
                db.run('DELETE FROM bind WHERE slack = ?', `${req.body.user_name}`);
                response.text = '成功解除綁定';
            }
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(response));
            res.end();
        });

        // db.close();
    } else {
        res.end();
    }
});

module.exports = router;
