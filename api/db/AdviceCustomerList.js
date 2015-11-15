
module.exports = function(sequelize, DataTypes) {

  var AdviceCustomerList = sequelize.define('AdviceCustomerList', {
    //通知狀況
    status: {
      type:DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    classMethods: {
      associate: (models) => {
        AdviceCustomerList.belongsTo(models.Product);
        AdviceCustomerList.belongsTo(models.User);
      }
    }
  });

  return AdviceCustomerList;
};