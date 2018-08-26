const bcrypt = require('bcrypt');
const crypto = require('crypto');
const debug = require('debug');

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
    hashPassword: async (passport) => {
      // eslint-disable-next-line
      await new Promise((defer, reject) => {
        if (passport.password) {
          bcrypt.hash(passport.password, 10, (err, hash) => {
            if (err) reject(err);
            // eslint-disable-next-line
            passport.password = hash;
            defer();
          });
        }
        defer();
      });
    },
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
  };

  Passport.options.instanceMethod = {
    async validatePassword (password) {
      try {
        const that = this;
        // eslint-disable-next-line
        let result = await new Promise((defer, reject) => {
          if (password === that.password) {
            defer(true);
          }
          // eslint-disable-next-line
          bcrypt.compare(password, that.password, (err, result) => {
            if (err) defer(false);
            else defer(result);
          });
        });
        if (result) return result;
        console.log('=== this.salt ===', that.salt);
        console.log('=== this.salt ===', result);
        if (!this.salt) return result;
        console.log('=== check two ===');
        const comparePassword = crypto.pbkdf2Sync(password, Buffer.from(this.salt, 'base64'), 10000, 64).toString('base64');
        if (comparePassword === that.password) {
          result = true;
        }
        return result;
      } catch (e) {
        throw e;
      }
    },
  };

  Passport.options.hooks = {
    async beforeCreate (passport) {
      return new Promise(async (resolve, reject) => {
        try {
          debug('beforeCreate');
          await Passport.hashPassword(passport);
          return resolve(passport);
        } catch (e) {
          debug('beforeCreate');
          return reject(e);
        }
      });
    },
    async beforeUpdate (passport) {
      return new Promise(async (resolve, reject) => {
        try {
          await Passport.hashPassword(passport);
          return resolve(passport);
        } catch (e) {
          return reject(e);
        }
      });
    },
  };
  return Passport;
};
