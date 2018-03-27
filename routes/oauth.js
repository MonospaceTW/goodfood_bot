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
                // check is in list and update list
                leveldb.get('goodfood', (err, value) => {
                    let tempJSON = { list: [] };
                    if (!err) {
                        tempJSON = JSON.parse(value);
                    }
                    const index = tempJSON.list.indexOf(result.user_id);
                    if (index !== -1) {
                        tempJSON.list[index] = result.user_id;
                    } else {
                        tempJSON.list.push(result.user_id);
                    }
                    leveldb.put('goodfood', JSON.stringify(tempJSON));
                });
                // update bind data
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
