const { comparePassword } = require('../utils/password');
class User{
    constructor() {

    }

    async findUserByEmail(email) {
        return await models.User.findOne({
            where: {
                email
            }
        });
    }

    async auth(email, password) {
        const user = await this.findUserByEmail(email);
        const passport = await models.Passport.findOne(
            {
                where: {
                    UserId: user.id,
                    
                }
            }
        )

        if (passport) return await comparePassword(password, user.password);

    }
}
module.exports = User;