const express = require('express');
const axios = require('axios');
const { WebClient } = require('@slack/client');

const CONFIG_SLACK = require('../../../config/slack.json');
const CONFIG_GITHUB = require('../../../config/github.json');
const leveldb = require('../../../leveldb');
const issueDialog = require('../../../templates/issue_dialog.json');

const web = new WebClient(CONFIG_SLACK.BOT_TOKEN);

const router = express.Router();

const hasConnectGitHub = async (req, res, next) => {
    const { user_id, channel_id } = req.body;
    try {
        const token = await leveldb.get(`${user_id}_token`);
        req.github_token = token;
        next();
    } catch (error) {
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
                                `?CLIENT_ID=${CONFIG_GITHUB.CLIENT_ID}` +
                                '&scope=user%20repo' +
                                `&state=${user_id}/${channel_id}`,
                        },
                    ],
                },
            ],
        });
    }
};

router.use('/', hasConnectGitHub);

// create issue
router.post('/', (req, res) => {
    const { text } = req.body;
    const inputs = text.split(' ');
    const repo = inputs[0];
    const title = inputs.slice(2, inputs.length).join(' ');
    const url = `https://api.github.com/repos/${
        CONFIG_GITHUB.ORGANIZATION
    }/${repo}/issues`;
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
            res.setHeader('Content-type', 'application/json');
            res.json({
                text: ':heavy_check_mark: Issue opened successfully.',
            });
        })
        .catch(() => {
            res.setHeader('Content-type', 'application/json');
            res.json({
                text: ':warning: Error occured while opening issue.',
            });
        });
});

router.post('/dialog', async (req, res) => {
    const { trigger_id } = req.body;
    const org = CONFIG_GITHUB.ORGANIZATION;

    const { data } = await axios.get(`https://api.github.com/orgs/${org}/repos?type=public`);

    const public_repos = data
        .sort((a, b) => {
            return a.updated_at < b.updated_at;
        })
        .map((e) => {
            return {
                value: e.name,
                label: e.name,
            };
        });

    try {
        // setup issue dialog template
        issueDialog.elements[0].value = org;
        issueDialog.elements[0].options = [
            {
                label: org,
                value: org,
            },
        ];

        issueDialog.elements[1].options = public_repos;

        // const issueDialog = {
        //     title: 'Create an issue',
        //     callback_id: 'submit-issue',
        //     submit_label: 'Submit',
        //     elements: [
        //         {
        //             label: 'Owner',
        //             type: 'select',
        //             name: 'owner',
        //             placeholder: 'Select a owner',
        //             value: CONFIG_GITHUB.ORGANIZATION,
        //             options: [
        //                 {
        //                     label: CONFIG_GITHUB.ORGANIZATION,
        //                     value: CONFIG_GITHUB.ORGANIZATION,
        //                 },
        //             ],
        //         },
        //         {
        //             label: 'Repository',
        //             type: 'select',
        //             name: 'repo',
        //             placeholder: 'Select a repository',
        //             value: 'goodfood',
        //             options: public_repos,
        //         },
        //         {
        //             label: 'Title',
        //             type: 'text',
        //             name: 'title',
        //             placeholder: 'Title',
        //         },
        //         {
        //             label: 'Description',
        //             type: 'textarea',
        //             name: 'description',
        //             optional: true,
        //             placeholder: 'Leave some descriptions',
        //         },
        //     ],
        // };

        await web.dialog.open(JSON.stringify(issueDialog), trigger_id);
        res.status(200).end();
    } catch (error) {
        res.sendStatus(500);
    }
});

module.exports = router;
