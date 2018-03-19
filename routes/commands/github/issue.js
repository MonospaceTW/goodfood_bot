const express = require('express');
const axios = require('axios');
const qs = require('querystring');
const { WebClient } = require('@slack/client');

const CONFIG_SLACK = require('../../../config/slack.json');
const CONFIG_GITHUB = require('../../../config/github.json');
const leveldb = require('../../../leveldb');

const web = new WebClient(CONFIG_SLACK.BOT_TOKEN);

const router = express.Router();

const hasConnectGitHub = (req, res, next) => {
    const { user_id } = req.body;
    leveldb.get(user_id)
        .then((token) => {
            req.github_token = token;
            next();
        })
        .catch(() => {
            res.setHeader('Content-Type', 'application/json');
            res.json({
                response_type: 'ephemeral',
                attachments: [
                    {
                        color: '#27ae60',
                        text:
                            ":information_source: You haven't connect your GitHub account",
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
        });
};

router.use('/', hasConnectGitHub);

// create issue
router.post('/', (req, res) => {
    const { text } = req.body;
    const inputs = text.split(' ');
    const owner = inputs[0];
    const repo = inputs[1];
    const title = inputs.slice(2, inputs.length).join(' ');
    const url = `https://api.github.com/repos/${owner}/${repo}/issues`;
    axios
        .post(
            url,
            { title },
            {
                headers: {
                    Authorization: `Bearer ${req.github_token}`,
                },
            },
        )
        .then(() => {
            res.setHeader('Content-Type', 'application/json');
            res.json({
                text: ':heavy_check_mark: Issue opened successfully.',
            });
        })
        .catch(() => {
            res.setHeader('Content-Type', 'application/json');
            res.json({
                text: ':warning: Error occured while opening issue.',
            });
        });
});

router.post('/dialog', (req, res) => {
    const { trigger_id } = req.body;
    const issueDialog = {
        title: 'Create an issue',
        callback_id: 'submit-issue',
        submit_label: 'Submit',
        elements: [
            {
                label: 'Owner',
                type: 'select',
                name: 'owner',
                placeholder: 'Select a owner',
                value: 'MonospaceTW',
                options: [
                    { label: 'MonospaceTW', value: 'MonospaceTW' },
                ],
            },
            {
                label: 'Repository',
                type: 'select',
                name: 'repo',
                placeholder: 'Select a repository',
                value: 'goodfood',
                options: [
                    { label: 'goodfood', value: 'goodfood' },
                    { label: 'goodfood_bot', value: 'goodfood_bot' },
                ],
            },
            {
                label: 'Title',
                type: 'text',
                name: 'title',
                placeholder: 'Title',
            },
            {
                label: 'Description',
                type: 'textarea',
                name: 'description',
                optional: true,
                placeholder: 'Leave some descriptions',
            },
        ],
    };

    web.dialog.open(JSON.stringify(issueDialog), trigger_id)
        .then(() => {
            res.status(200).end();
        }).catch(() => {
            res.sendStatus(500);
        });
});

module.exports = router;
