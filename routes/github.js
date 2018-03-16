const express = require('express');
const axios = require('axios');
const CONFIG_GITHUB = require('../config/github.json');

const db = require('../leveldb');

const router = express.Router();

// Handle GitHub OAuth callback
router.get('/authorize', (req, res) => {
    axios.post('https://github.com/login/oauth/access_token', {
        CLIENT_ID: CONFIG_GITHUB.CLIENT_ID,
        CLIENT_SECRET: CONFIG_GITHUB.CLIENT_SECRET,
        code: req.query.code,
    }, {
        headers: {
            Accept: 'application/json',
        },
    }).then((resp) => {
        const user_id = req.query.state;
        db.put(user_id, resp.data.access_token);
        res.send('Successfully connect to your GitHub account, you could close this page.');
    }).catch((err) => {
        res.send(err);
    });
});

module.exports = router;
