module.exports = (sequelize, DataTypes) => {
  const UserOrder = sequelize.define('UserOrder', {
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    count: {
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
    UserOrder.belongsTo(models.GroupOrder);
    UserOrder.belongsTo(models.Food);
  };
  return UserOrder;
};
