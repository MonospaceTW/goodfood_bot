const express = require('express');
const fs = require('fs');
const leveldb = require('../../leveldb');
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
    response.text = 'ok';
    // check if send from slack
    if (req.body.token === token) {
        if (req.body.text === '1') {
            leveldb.del('order').then((err) => {
                res.end();
            });
        } else {
            db.run('DELETE FROM bind WHERE slack = ?', `${req.body.text}`);
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(response));
            res.end();
        }
    } else {
        res.end();
    }
});

module.exports = router;
