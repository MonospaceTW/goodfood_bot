const express = require('express');
const axios = require('axios');
const CONFIG_SLACK = require('../config/slack.json');
const CONFIG_GITHUB = require('../config/github.json');
const { WebClient } = require('@slack/client');
const db = require('../leveldb');

const web = new WebClient(CONFIG_SLACK.BOT_TOKEN);

const router = express.Router();

// Handle GitHub OAuth callback
router.get('/authorize', (req, res) => {
    axios.post(
        'https://github.com/login/oauth/access_token',
        {
            client_id: CONFIG_GITHUB.CLIENT_ID,
            client_secret: CONFIG_GITHUB.CLIENT_SECRET,
            code: req.query.code,
        },
        {
            headers: {
                Accept: 'application/json',
            },
        },
    )
        .then((resp) => {
            const user_id = req.query.state;
            const { access_token } = resp.data;
            return db.put(`${user_id}_token`, access_token);
        })
        .then((resp) => {
            const user_id = req.query.state;
            return web.chat.postMessage(user_id, ':heavy_check_mark: You have already connected.');
        })
        .then((resp) => {
            res.send('<p>Successfully connect to your GitHub account, you could close this page.</p>');
        })
        .catch((err) => {
            res.send(err);
        });
});

module.exports = router;
