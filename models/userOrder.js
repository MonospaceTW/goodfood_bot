module.exports = (sequelize, DataTypes) => {
  const UserOrder = sequelize.define('UserOrder', {
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    subTotal: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    remark: DataTypes.STRING,
  });

  UserOrder.associate = function (models) {
    UserOrder.belongsTo(models.User);
    UserOrder.belongsTo(models.Order);
    UserOrder.belongsTo(models.Food);
  };
  return UserOrder;
};
