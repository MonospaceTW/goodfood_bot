module.exports = (sequelize, DataTypes) => {
  const Food = sequelize.define('Food', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  Food.associate = function (models) {
    Food.belongsTo(models.Restaurant);
    Food.hasMany(models.UserOrder);
  };
  return Food;
};
