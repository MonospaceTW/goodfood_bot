const { WebClient } = require('@slack/client');
const express = require('express');
const SLACK = require('../config/slack.json');
const leveldb = require('../leveldb');

const token = SLACK.BOT_TOKEN;
const clientId = SLACK.CLIENT_ID;
const clientSecret = SLACK.CLIENT_SECRET;

const web = new WebClient(token);
const router = express.Router();

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
                leveldb.put(`goodfood/${result.user_id}`, `${state}`, (err) => {
                    if (err) {
                        res.send(JSON.stringify({ ok: false, bind: false }));
                    } else {
                        res.send(JSON.stringify({ ok: true, bind: true }));
                    }
                    res.end();
                });
            }
        }).catch(() => {
            res.status(400);
            res.send(JSON.stringify({ ok: false }));
            res.end();
        });
    }
});
module.exports = router;
