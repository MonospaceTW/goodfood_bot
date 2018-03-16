const { WebClient } = require('@slack/client');
const express = require('express');
const SqliteDb = require('./sqlite/sqlitedb');
const CONFIG_SLACK = require('../config/slack.json');

// get slack bot token
const token = CONFIG_SLACK.BOT_TOKEN;

const web = new WebClient(token);
const router = express.Router();

const db = new SqliteDb();
const attach = {};

router.post('/', (req, res, next) => {
    const to = req.body.channel ? req.body.channel : '#test-bot';
    attach.username = req.body.botname ? req.body.botname : 'goodfood_bot';
    attach.icon_url = req.body.iconurl ? req.body.iconurl : 'http://goodfood-beta.trunksys.com/images/sushi.jpg';
    const goodname = req.header('Authorization');
    const row = db.read('SELECT goodfood FROM Bind WHERE goodfood = ?', `${goodname}`);
    row.then((col) => {
        if (col.length > 0) {
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Access-Control-Allow-Origin', '*');
            web.chat.postMessage(to, req.body.message, attach).then((result) => {
                if (result.ok) {
                    res.send(JSON.stringify({ ok: true }));
                    res.end();
                }
            }).catch(() => {
                res.status(400);
                res.send(JSON.stringify({ ok: false }));
                res.end();
            });
        } else {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.status(401);
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({ ok: false }));
            res.end();
        }
    });
});

router.options('/', (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    res.end();
});

module.exports = router;
