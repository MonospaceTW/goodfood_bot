module.exports = (sequelize, DataTypes) => {
  const GroupOrder = sequelize.define('GroupOrder', {
    total: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    startedAt: DataTypes.DATE,
    finishedAt: DataTypes.DATE,
    remark: DataTypes.STRING,
  });

  GroupOrder.associate = function(models) {
    GroupOrder.belongsTo(models.Restaurant);
    GroupOrder.hasMany(models.UserOrder);
  };
  return GroupOrder;
};
