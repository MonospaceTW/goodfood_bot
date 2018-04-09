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
            const user_id = req.query.state.split('/')[0];
            const { access_token } = resp.data;
            return db.put(`${user_id}_token`, access_token).then(() => {
                return db.get(`${user_id}_token`);
            });
        })
        .then((access_token) => {
            return axios.get('https://api.github.com/user', {
                headers: {
                    Authorization: `token ${access_token.toString()}`,
                },
            });
        })
        .then((resp) => {
            const user_id = req.query.state.split('/')[0];
            const channel_id = req.query.state.split('/')[1];
            const user = resp.data;
            return web.chat.postEphemeral(
                channel_id,
                `You have connected to ${user.login}.`,
                user_id,
                {
                    attachments: [
                        {
                            color: '#0E163B',
                            author_name: `${user.login}`,
                            author_icon: `${user.avatar_url}`,
                            author_link: `${user.html_url}`,
                            callback_id: 'disconnect',
                            fields: [
                                {
                                    title: 'Name',
                                    value: `${user.name}`,
                                    short: true,
                                },
                                {
                                    title: 'Email',
                                    value: `${user.email}`,
                                    short: true,
                                },
                                {
                                    title: 'Company',
                                    value: `${user.company}`,
                                    short: true,
                                },
                                {
                                    title: 'Location',
                                    value: `${user.location}`,
                                    short: true,
                                },
                            ],
                            actions: [
                                {
                                    text: 'Profile',
                                    type: 'button',
                                    url: `${user.html_url}`,
                                },
                                {
                                    name: 'disconnect',
                                    text: 'Disconnect',
                                    type: 'button',
                                    value: 'disconnect',
                                    style: 'danger',
                                },
                            ],
                        },
                    ],
                },
            );
        })
        .then((resp) => {
            if (resp.ok) {
                res.send('<h1>Successfully connect to your GitHub account, you could close this page.</h1>');
            } else {
                res.statusCode(500).end(resp.error);
            }
        })
        .catch((err) => {
            res.send(err);
        });
});

module.exports = router;
