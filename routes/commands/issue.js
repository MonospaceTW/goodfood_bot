const express = require('express');

const router = express.Router();

router.post('/', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    if (req.body.token === 'S3Kizw5s0LYgspz80RutJFxH') {
        res.send(JSON.stringify({
            response_type: 'ephemeral',
            text: `List issues from Repo: ${req.body.text}`,
        }));
        res.end();
    } else {
        res.end();
    }
});

module.exports = router;
