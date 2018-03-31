const { WebClient } = require('@slack/client');
const express = require('express');
const leveldb = require('../leveldb');
const SLACK = require('../config/slack.json');
const VIEW = require('../config/view.json');

const token = SLACK.BOT_TOKEN;

const web = new WebClient(token);
const router = express.Router();

router.post('/', (req, res, next) => {
    const attach = {};
    const to = req.body.channel ? req.body.channel : '#test-bot';
    attach.username = req.body.botname ? req.body.botname : 'goodfood_bot';
    attach.icon_url = req.body.iconurl ? req.body.iconurl : 'http://goodfood-beta.trunksys.com/images/sushi.jpg';

    // 點餐按鈕
    if (req.body.attachments === 'yes') {
        const btn = JSON.parse(JSON.stringify(VIEW.order_btn));

        // 有網頁連結
        if (req.body.order_url) {
            btn.actions[0].url = req.body.order_url;
        } else { // 沒網頁連結
            btn.actions.shift();
        }

        // 有 slack 點餐
        if (req.body.order_id && req.body.order_store) {
            // 添加按鈕
            btn.callback_id = `add_in/${req.body.order_id}/${req.body.order_store}`;
            const orderId = req.body.order_id;

            // 加入資料庫 2.0
            leveldb.get('order', (err, value) => {
                let tempJSON = { list: [] };
                if (!err) {
                    tempJSON = JSON.parse(value);
                }
                const index = tempJSON.list.indexOf(orderId);
                if (index === -1) {
                    tempJSON.list.push(orderId);
                }
                leveldb.put('order', JSON.stringify(tempJSON));
            });

            leveldb.put(`order/${orderId}/store`, req.body.order_store);
        } else { // 沒 slack 點餐
            btn.actions.pop();
        }
        attach.attachments = [btn];
    }

    // 發送
    const goodname = req.header('Authorization');
    // get bind member here to check auth
    if (true || goodname) {
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
