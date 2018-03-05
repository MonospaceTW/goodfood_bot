const { WebClient } = require('@slack/client');
const fs = require('fs');
const express = require('express');

// get slack bot token
const contents = fs.readFileSync('config.json');
const jsonContent = JSON.parse(contents);
const token = jsonContent.bot_token;

const web = new WebClient(token);
const router = express.Router();

const to = '#test-bot';
const attach = {
    username: 'goodfood_bot',
    icon_url: 'https://www.osustuff.org/img/avatars/2017-04-22/211652.jpg',
};

router.post('/', (req, res, next) => {
    web.chat.postMessage(to, req.body.message, attach).then((result) => {
        if (result.ok) {
            console.log(`send message: ${result.message.text}`);
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.send(JSON.stringify({ ok: true }));
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
