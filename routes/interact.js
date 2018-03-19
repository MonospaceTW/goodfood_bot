const express = require('express');
const { WebClient } = require('@slack/client');
const CONFIG_SLACK = require('../config/slack.json');
const submit_issue = require('./interact/submit_issue');

const web = new WebClient(CONFIG_SLACK.BOT_TOKEN);

const router = express.Router();

router.post('/', (req, res) => {
    const {
        callback_id, submission, user, token, channel,
    } = JSON.parse(req.body.payload);
    if (token !== CONFIG_SLACK.VERIFICATION_TOKEN) {
        res.status(403).end('Access Forbidden');
    } else {
        switch (callback_id) {
        case 'submit-issue':
            submit_issue(submission, user)
                .then((issue) => {
                    res.status(200).send({});
                    web.chat.postMessage(
                        channel.id,
                        `Issue opened by ${issue.user.login}`,
                        {
                            username: 'GitHub - MonospaceTW',
                            icon_url: 'https://avatars3.githubusercontent.com/u/34531823?s=200&v=4',
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
                    });
                })
                .catch((err) => {
                    res.status(500).end(err);
                });
            break;
        default:
            break;
        }
    }
});

module.exports = router;
