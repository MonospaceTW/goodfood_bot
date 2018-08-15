const Enum = require('enum');
module.exports = (sequelize, DataTypes) => {
  const Passport = sequelize.define('Passport', {
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    provider: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 2,
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    workspaceName: DataTypes.STRING,
  });

  Passport.associate = function (models) {
    Passport.belongsTo(models.User);
  },

  Passport.providerCode = function () {
    return new Enum({ 'SLACK': 0, 'FIREBASE': 1, 'LOCAL': 2,});
  };
  return Passport;
};
