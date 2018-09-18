const { comparePassword } = require('../utils/password');
class User {
  constructor () {
  }

  async findUserByEmail (email) {
    const user = await models.User.findOne({
      where: {
        email,
      },
    });
    return user;
  }

  async auth (email, password) {
    const user = await this.findUserByEmail(email);
    const passport = await models.Passport.findOne(
      {
        where: {
          UserId: user.id,
        }
      }
    );
    if (passport) return await comparePassword(password, passport.password);
  }
}
module.exports = User;
