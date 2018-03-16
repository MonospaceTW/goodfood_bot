const express = require('express');
const fs = require('fs');
const SqliteDb = require('../sqlite/sqlitedb');

// get app verification_token
const contents = fs.readFileSync('config.json');
const jsonContent = JSON.parse(contents);
const token = jsonContent.verification_token;

const router = express.Router();
const db = new SqliteDb();

router.post('/', (req, res, next) => {
    const response = {};
    response.response_type = 'ephemeral';
    // check if send from slack
    if (req.body.token === token) {
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
