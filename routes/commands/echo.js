const express = require('express');

const router = express.Router();

router.post('/', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.json({
        response_type: 'ephemeral',
        text: `${req.body.text}`,
    });
});

module.exports = router;
