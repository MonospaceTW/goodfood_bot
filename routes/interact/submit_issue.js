const axios = require('axios');
const leveldb = require('../../leveldb');

module.exports = (submission, user) => {
    const {
        owner, repo, title, description,
    } = submission;

    return new Promise((resolve, reject) => {
        leveldb.get(user.id)
            .then((token) => {
                axios.post(
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
                ).then((res) => {
                    resolve(res.data);
                }).catch((err) => {
                    reject(err);
                });
            }).catch((err) => {
                reject(err);
            });
    });
};
