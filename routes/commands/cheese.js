const express = require('express');

const router = express.Router();
const str = ['可愛', '性感', '斂財', '白癡', '帥氣', '囂張', '聰明', '無言', '中二', '嘴砲', '快', '慢', '奇葩'];

router.post('/', (req, res, next) => {
    const num = Math.floor(Math.random() * 13);
    res.setHeader('Content-Type', 'application/json');
    res.send(req.body.token === 'S3Kizw5s0LYgspz80RutJFxH' ? JSON.stringify({
        response_type: 'in_channel',
        text: `${req.body.user_name}是最${str[num]}的人`,
        attachments: [
            {
                text: '每日占卜~',
            },
        ],
    }) : JSON.stringify({
        response_type: 'in_channel',
        text: 'someone try to do something very bad!',
    }));
});

module.exports = router;
