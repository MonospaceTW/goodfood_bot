const { WebClient } = require('@slack/client');
const fs = require('fs');
const express = require('express');
const leveldb = require('../leveldb');
const SqliteDb = require('./sqlite/sqlitedb');

// get slack bot token
const contents = fs.readFileSync('config.json');
const jsonContent = JSON.parse(contents);
const token = jsonContent.bot_token;

const web = new WebClient(token);
const router = express.Router();

const db = new SqliteDb();
const attach = {};

const btn = {
    fallback: '你可以在 slack 點餐',
    callback_id: 'add_in',
    color: '#3AA3E3',
    actions: [
        {
            name: 'order',
            text: '在 slack 點餐',
            type: 'button',
            value: 'Y87G87',
        },
    ],
};

router.post('/', (req, res, next) => {
    const to = req.body.channel ? req.body.channel : '#test-bot';
    attach.username = req.body.botname ? req.body.botname : 'goodfood_bot';
    attach.icon_url = req.body.iconurl ? req.body.iconurl : 'http://goodfood-beta.trunksys.com/images/sushi.jpg';
    // 這邊還要把 button actions 裡的 value 值改成訂單編號
    attach.attachments = req.body.attachments === 'yes' ? [btn] : [];
    const goodname = req.header('Authorization');
    const row = db.read('SELECT goodfood FROM Bind WHERE goodfood = ?', `${goodname}`);
    row.then((col) => {
        if (col.length > 0 || true) {
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Access-Control-Allow-Origin', '*');
            web.chat.postMessage(to, req.body.message, attach).then((result) => {
                if (result.ok) {
                    leveldb.get('order', (err, value) => {
                        let tempJSON = {};
                        const orderId = 'Y87G87';
                        if (!err) {
                            tempJSON = JSON.parse(value);
                        }
                        tempJSON[orderId] = {
                            storeId: 'ASDASD',
                            list: {},
                        };
                        leveldb.put('order', JSON.stringify(tempJSON));
                    });
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
