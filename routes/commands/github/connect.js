const express = require('express');
const leveldb = require('../../../leveldb');
const CONFIG_GITHUB = require('../../../config/github.json');

const router = express.Router();

// connect to github account
router.post('/', (req, res) => {
    const { user_id } = req.body;
    leveldb
        .get(user_id)
        .then(() => {
            res.json({
                response_type: 'ephemeral',
                text: ':heavy_check_mark: You have already connected.',
            });
        })
        .catch((err) => {
            if (err.notFound) {
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
                                    url:
                                        'https://github.com/login/oauth/authorize' +
                                        `?CLIENT_ID=${
                                            CONFIG_GITHUB.CLIENT_ID
                                        }` +
                                        '&scope=user%20repo' +
                                        `&state=${user_id}`,
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
