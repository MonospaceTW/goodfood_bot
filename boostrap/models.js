const env = process.env.NODE_ENV || 'development';
const config = require('config')[env];
module.exports = {
    async resetDb() {
        if (config.drop) await models.sequelize.dropAllSchemas();
        await models.sequelize.sync({
            force: config.drop
        });
    },
    async init() {
        await models.User.create({
            nickName: 'admin',
            email: 'admin@mail.com'
        })
    }
}