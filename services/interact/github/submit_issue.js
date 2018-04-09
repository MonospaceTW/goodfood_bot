const axios = require('axios');
const { WebClient } = require('@slack/client');
const leveldb = require('../../../leveldb');
const CONFIG_SLACK = require('../../../config/slack.json');

const web = new WebClient(CONFIG_SLACK.BOT_TOKEN);

module.exports = async (payload, res) => {
    try {
        const { submission, user, channel } = payload;
        const { owner, repo, title, description } = submission;

        const token = await leveldb.get(`${user.id}_token`);
        const { data: issue } = await axios.post(
            `https://api.github.com/repos/${owner}/${repo}/issues`,
            {
                title,
                body: description,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        );
        const msgResp = await web.chat.postMessage(
            channel.id,
            `Issue opened by ${issue.user.login}`,
            {
                attachments: [
                    {
                        color: '#0E163B',
                        author_name: `${issue.user.login}`,
                        author_icon: `${issue.user.avatar_url}`,
                        author_link: `${issue.user.html_url}`,
                        title: `#${issue.number} ${issue.title}`,
                        title_link: `${issue.html_url}`,
                        text: `${issue.body}`,
                        footer: `${owner}/${repo}`,
                        footer_icon:
                        'https://assets-cdn.github.com/images/modules/logos_page/GitHub-Mark.png',
                        ts: Date.now(),
                    },
                ],
            },
        );
        if (msgResp.ok) {
            res.status(200).send({}).end();
        } else {
            res.status(500).end(msgResp.error);
        }
    } catch (error) {
        res.status(500).end(error);
    }
};
