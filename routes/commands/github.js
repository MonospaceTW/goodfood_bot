const express = require('express');
const axios = require('axios');

const CONFIG_SLACK = require('../../config.json');
const CONFIG_GITHUB = require('../../config/github.json');
const db = require('../../leveldb');

const router = express.Router();

// connect to github account
router.post('/connect', (req, res) => {
    if (req.body.token !== CONFIG_SLACK.verification_token) {
        res.status(403).end('Access Forbidden');
    } else {
        const { user_id } = req.body;
        db.get(user_id)
            .then(() => {
                res.json({
                    response_type: 'ephemeral',
                    text: ':heavy_check_mark: You have already connected.',
                });
            })
            .catch((err) => {
                if (err.notFound) {
                    db.put(user_id, '')
                        .then(() => {
                            res.setHeader('Content-Type', 'application/json');
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
                                                url: 'https://github.com/login/oauth/authorize' +
                                                    `?client_id=${CONFIG_GITHUB.client_id}` +
                                                    '&scope=user%20repo' +
                                                    `&state=${user_id}`,
                                            },
                                        ],
                                    },
                                ],
                            });
                        })
                        .catch(() => {
                            res.status(500).end('Server error.');
                        });
                }
            });
    }
});

// create issue
router.post('/issue', (req, res) => {
    if (req.body.token !== CONFIG_SLACK.verification_token) {
        res.status(403).end('Access Forbidden');
    } else {
        const { user_id, text } = req.body;
        db.get(user_id)
            .then((token) => {
                const inputs = text.split(' ');
                const owner = inputs[0];
                const repo = inputs[1];
                const title = inputs.slice(2, inputs.length).join(' ');
                const url = `https://api.github.com/repos/${owner}/${repo}/issues`;
                axios.post(url, { title }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }).then(() => {
                    res.setHeader('Content-Type', 'application/json');
                    res.json({
                        text: ':heavy_check_mark: Issue opened successfully.',
                    });
                }).catch(() => {
                    res.setHeader('Content-Type', 'application/json');
                    res.json({
                        text: ':warning: Error occured while opening issue.',
                    });
                });
            })
            .catch(() => {
                res.setHeader('Content-Type', 'application/json');
                res.json({
                    response_type: 'ephemeral',
                    attachments: [
                        {
                            color: '#27ae60',
                            text: ':information_source: You haven\'t connect your GitHub account',
                            callback_id: 'github_oauth',
                            actions: [
                                {
                                    name: 'connect',
                                    text: 'Connect',
                                    type: 'button',
                                    value: 'connect',
                                    style: 'primary',
                                    url: 'https://github.com/login/oauth/authorize' +
                                        `?client_id=${CONFIG_GITHUB.client_id}` +
                                        '&scope=user%20repo' +
                                        `&state=${user_id}`,
                                },
                            ],
                        },
                    ],
                });
            });
    }
});

module.exports = router;
