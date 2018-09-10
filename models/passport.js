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

  Passport.hashPassword = function (passport) {
    // eslint-disable-next-line
    return new Promise((resolve, reject) => {
      try {
        if (passport.password) {
          bcrypt.hash(passport.password, 10, (err, hash) => {
            if (err) reject(err);
            // eslint-disable-next-line
            passport.password = hash;
          });
        }
        resolve(passport);
      } catch (e) {
        reject(e);
      }
    });
  };
  Passport.createDefaultLocalProviderIfNotExist = async function (user) {
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
  };

  Passport.prototype.validatePassword = async function (password) {
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
  };

  Passport.hook('beforeCreate', (passport, options) => {
    return new Promise(async (resolve, reject) => {
      console.log('beforeCreate ==');
      if (passport.password) {
        bcrypt.hash(passport.password, 10, (err, hash) => {
          if (err) reject(err);
          // eslint-disable-next-line
          passport.password = hash;
          return resolve(passport);
        });
      } else {
        return reject('password cannot be null');
      }
    });
  });

  Passport.hook('beforeUpdate', async (passport, options) => {
    return new Promise(async (resolve, reject) => {
      console.log('beforeCreate ==');
      if (passport.password) {
        bcrypt.hash(passport.password, 10, (err, hash) => {
          if (err) reject(err);
          // eslint-disable-next-line
          passport.password = hash;
          return resolve(passport);
        });
      } else {
        return reject('password cannot be null');
      }
    });
  });
  return Passport;
};
