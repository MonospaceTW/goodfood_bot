const express = require('express');

const router = express.Router();

router.post('/', (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    console.log(req.body);
    res.end();
});

module.exports = router;
