module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    nickName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false
    }});

  User.associate = function (models) {
    User.hasMany(models.UserOrder);
    User.hasMany(models.Passport);
  };
  return User;
};
