const express = require('express');
const octokit = require('@octokit/rest')();

const router = express.Router();

router.post('/repos', async (req, res) => {
    const result = await octokit.repos.getForOrg({
        org: 'MonospaceTW',
        type: 'all',
    });
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(result.data));
    res.end();
});

router.post('/issues/:repo', async (req, res) => {
    const result = await octokit.issues.getForRepo({
        owner: 'MonospaceTW',
        repo: req.params.repo,
    });
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(result.data));
    res.end();
});

module.exports = router;
