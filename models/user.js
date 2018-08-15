module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    nickName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  });

  User.associate = function (models) {
    User.hasMany(models.UserOrder);
    User.hasMany(models.Passport);
  };
  return User;
};
