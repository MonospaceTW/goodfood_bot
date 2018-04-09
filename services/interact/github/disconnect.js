const leveldb = require('../../../leveldb');

module.exports = async (payload, res) => {
    try {
        const { user } = payload;
        await leveldb.del(`${user.id}_token`);
        res.json({
            response_type: 'ephemeral',
            text: ':disappointed: You have disconnected.',
        });
    } catch (err) {
        res.status(500).end(err);
    }
};
