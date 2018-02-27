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
            res.send(JSON.stringify({ ok: true }));
        }
    });
});

module.exports = router;
