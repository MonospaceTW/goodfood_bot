const express = require('express');
const leveldb = require('../../leveldb');
const SqliteDb = require('../sqlite/sqlitedb');
const SLACK = require('../../config/slack.json');

const token = SLACK.VERIFICATION_TOKEN;

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
