const { WebClient } = require('@slack/client');
const express = require('express');
const SqliteDb = require('./sqlite/sqlitedb');
const SLACK = require('../config/slack.json');

const token = SLACK.BOT_TOKEN;
const clientId = SLACK.CLIENT_ID;
const clientSecret = SLACK.CLIENT_SECRET;

const web = new WebClient(token);
const router = express.Router();

const db = new SqliteDb();

router.get('/', (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    const codee = req.query.code ? req.query.code : false;
    const state = req.query.state ? req.query.state : false;
    if (!codee && !state) {
        res.status(400);
        res.send(JSON.stringify({ ok: false }));
    } else {
        web.oauth.access(clientId, clientSecret, codee).then((result) => {
            if (result.ok) {
                db.run('DELETE FROM Bind WHERE goodfood = ? OR slack = ?', `${state}`, `${result.user_id}`);
                db.run('INSERT INTO Bind VALUES (?, ?)', `${result.user_id}`, `${state}`);
                res.send(JSON.stringify({ ok: true, bind: true }));
                res.end();
            }
        }).catch(() => {
            res.status(400);
            res.send(JSON.stringify({ ok: false }));
            res.end();
        });
    }
});
module.exports = router;
