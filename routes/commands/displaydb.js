const express = require('express');
const fs = require('fs');
const SqliteDb = require('../sqlite/sqlitedb');
const leveldb = require('../../leveldb');

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
        if (req.body.text === '1') {
            leveldb.get('order', (err, value) => {
                if (!err) {
                    res.send(value.toString('utf8'));
                }
                res.end();
            });
        } else {
            const row = db.read('SELECT rowid, slack, goodfood FROM Bind');
            row.then((col) => {
                response.text = '';
                col.forEach((element) => {
                    response.text = `${response.text}rowid: ${element.rowid}  slack: ${element.slack}  goodfood: ${element.goodfood}\n`;
                });
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(response));
                res.end();
            });
        }

        // db.close();
    } else {
        res.end();
    }
});

module.exports = router;
