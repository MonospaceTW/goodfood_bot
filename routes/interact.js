const express = require('express');
const { WebClient } = require('@slack/client');
const CONFIG_SLACK = require('../config/slack.json');
const submit_issue = require('./interact/submit_issue');
const leveldb = require('../leveldb');

const web = new WebClient(CONFIG_SLACK.BOT_TOKEN);

const router = express.Router();

router.post('/', (req, res) => {
    const { callback_id, submission, user, channel } = JSON.parse(req.body.payload);

    if (callback_id === 'disconnect') {
        leveldb.del(`${user.id}_token`)
            .then(() => {
                res.json({
                    response_type: 'ephemeral',
                    text: ':disappointed: You have disconnected.',
                });
            }).catch((err) => {
                res.status(500).end(err);
            });
    }

    if (callback_id === 'submit-issue') {
        submit_issue(submission, user)
            .then((issue) => {
                res.status(200).send({});
                web.chat.postMessage(
                    channel.id,
                    `Issue opened by ${issue.user.login}`,
                    {
                        attachments: [{
                            color: '#0E163B',
                            author_name: `${issue.user.login}`,
                            author_icon: `${issue.user.avatar_url}`,
                            author_link: `${issue.user.html_url}`,
                            title: `#${issue.number} ${issue.title}`,
                            title_link: `${issue.html_url}`,
                            text: `${issue.body}`,
                            footer: `${submission.owner}/${submission.repo}`,
                            footer_icon: 'https://assets-cdn.github.com/images/modules/logos_page/GitHub-Mark.png',
                            ts: Date.now(),
                        }],
                    },
                ).then((resp) => {
                    if (resp.ok) {
                        res.end();
                    } else {
                        res.status(500).end(resp.error);
                    }
                }).catch((err) => {
                    res.status(500).end(err);
                });
            })
            .catch((err) => {
                res.status(500).end(err);
            });
    }
});

module.exports = router;
