module.exports = (sequelize, DataTypes) => {
  const Restaurant = sequelize.define('Restaurant', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imageUrl: DataTypes.STRING,
    address: DataTypes.STRING,
    orderInUnit: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '個/元',
    },
    orderRequirement: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    remark: DataTypes.STRING,
  });

  Restaurant.associate = function (models) {
    Restaurant.hasMany(models.Food);
    Restaurant.hasMany(models.GroupOrder);
  };
  return Restaurant;
};
