const bcrypt = require('bcrypt');
const crypto = require('crypto');

module.exports = (sequelize, DataTypes) => {
  const Passport = sequelize.define('Passport', {
    provider: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    workspaceName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  Passport.associate = function (models) {
    Passport.belongsTo(models.User);
  };

  Passport.options.classMethod = {
    async createDefaultLocalProviderIfNotExist (user) {
      try {
        const localPassport = await Passport.findOne({
          where: {
            provider: 'local',
            userId: user.id,
          },
        });
        console.log('localPassport ==', localPassport);
        if (localPassport == null) {
          const newLocalPassport = {
            provider: 'local',
            password: 'password',
            userId: user.id,
          };
          console.log('=== newLocalPassport ===', newLocalPassport);
          await Passport.create(newLocalPassport);
        }
      } catch (e) {
        throw e;
      }
    },
    async hashPassword (passport) {
      try {
        if (passport.password) {
          const hash = await bcrypt.hashSync(passport.password, 10);
          // eslint-disable-next-line
          passport.password = hash;
        }
        return passport;
      } catch (e) {
        throw e;
      }
    },
  };

  Passport.options.instanceMethod = {
    async validatePassword (inputPassword) {
      try {
        const that = this;
        // eslint-disable-next-line
        let result = await new Promise((defer, reject) => {
          if (inputPassword === that.password) {
            defer(true);
          }
          // eslint-disable-next-line
          bcrypt.compare(inputPassword, that.password, (err, result) => {
            if (err) defer(false);
            else defer(result);
          });
        });
        console.log('=== result ===', result);
        if (result) return result;

        console.log('=== this.salt ===', that.salt);
        if (!this.salt) return result;

        console.log('=== check two ===');
        const comparePassword = crypto
          .pbkdf2Sync(
            inputPassword,
            Buffer.from(this.salt, 'base64'),
            10000,
            64,
          )
          .toString('base64');
        if (comparePassword === that.password) {
          result = true;
        }
        return result;
      } catch (e) {
        throw e;
      }
    },
  };

  Passport.hook('beforeCreate', async (passport, options) => {
    const hashedPassport = await Passport.hashPassword(passport);
    // console.log('hashedPassport=>', hashedPassport);
    return hashedPassport;
  });

  Passport.hook('beforeUpdate', async (passport, options) => {
    const hashedPassport = await Passport.hashPassword(passport);
    // console.log('hashedPassport=>', hashedPassport);
    return hashedPassport;
  });
  return Passport;
};
