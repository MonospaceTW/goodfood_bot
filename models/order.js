module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    total: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    finishedAt: DataTypes.DATE,
  });

  Order.associate = function(models) {
    Order.belongsTo(models.Restaurant);
    Order.hasMany(models.UserOrder);
  };
  return Order;
};
