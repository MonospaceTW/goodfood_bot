const { WebClient } = require('@slack/client');
const express = require('express');
const SLACK = require('../config/slack.json');

const token = SLACK.BOT_TOKEN;

const web = new WebClient(token);
const router = express.Router();

router.get('/', (req, res, next) => {
    // 發送
    const goodname = req.header('Authorization');
    if (true || goodname === '0ffd55100b68587e9cb7613481a0bc89a5c822bbf5b1dca49299f21ce13fb520') {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');
        web.channels.list().then((result) => {
            if (result.ok) {
                const channel = { ok: true, channels: [] };
                result.channels.forEach((c) => {
                    channel.channels.push({ id: c.id, name: c.name });
                });
                res.send(JSON.stringify(channel));
                res.end();
            }
        }).catch(() => {
            res.status(400);
            res.send(JSON.stringify({ ok: false }));
            res.end();
        });
    } else {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(403);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({ ok: false }));
        res.end();
    }
});

router.options('/', (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    res.end();
});

module.exports = router;
