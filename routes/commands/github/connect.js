const express = require('express');
const axios = require('axios');
const leveldb = require('../../../leveldb');
const CONFIG_GITHUB = require('../../../config/github.json');

const router = express.Router();

// connect to github account
router.post('/', (req, res) => {
    const { user_id } = req.body;
    leveldb
        .get(`${user_id}_token`)
        .then((access_token) => {
            return axios.get('https://api.github.com/user', {
                headers: {
                    Authorization: `token ${access_token.toString()}`,
                },
            });
        })
        .then((resp) => {
            const user = resp.data;
            res.json({
                response_type: 'ephemeral',
                attachments: [
                    {
                        pretext: `You have connected to ${user.login}.`,
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
            });
        })
        .catch((err) => {
            if (err.notFound) {
                res.json({
                    response_type: 'ephemeral',
                    attachments: [
                        {
                            color: '#27ae60',
                            text: 'Connect your GitHub account',
                            callback_id: 'github_oauth',
                            actions: [
                                {
                                    name: 'connect',
                                    text: 'Connect',
                                    type: 'button',
                                    value: 'connect',
                                    style: 'primary',
                                    url:
                                        'https://github.com/login/oauth/authorize' +
                                        `?client_id=${CONFIG_GITHUB.CLIENT_ID}` +
                                        '&scope=user%20repo' +
                                        `&state=${user_id}/${req.body.channel_id}`,
                                },
                            ],
                        },
                    ],
                });
            } else {
                res.sendStatus(500);
            }
        });
});

module.exports = router;
