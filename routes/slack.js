const express = require('express');

const cheese = require('./commands/cheese');

const router = express.Router();

router.post('/cheese', (req, res, next) => {
    const num = Math.floor(Math.random() * 13);
    res.setHeader('Content-Type', 'application/json');
    res.send(req.body.token === 'S3Kizw5s0LYgspz80RutJFxH' ? JSON.stringify({
        response_type: 'in_channel',
        text: `${req.body.user_name}是最${cheese[num]}的人`,
        username: 'goodfood_bot',
        icon_url: 'https://www.osustuff.org/img/avatars/2017-04-22/211652.jpg',
        attachments: [
            {
                text: '每日占卜~',
            },
        ],
    }) : JSON.stringify({ ok: false }));
});

module.exports = router;
