module.exports = (sequelize, DataTypes) => {
  const Restaurant = sequelize.define('Restaurant', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imgUrl: DataTypes.STRING,
    address: DataTypes.STRING,
    orderInUnit: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    orderRequirement: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    startTime: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    endTime: {
      type: DataTypes.INTEGER,
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
    Restaurant.hasMany(models.Order);
  };
  return Restaurant;
};
