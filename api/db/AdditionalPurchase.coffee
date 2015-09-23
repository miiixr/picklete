
module.exports = (sequelize, DataTypes) ->
  AdditionalPurchase = sequelize.define('AdditionalPurchase', {
    limit: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
    name: DataTypes.STRING
    discount: DataTypes.FLOAT
    reducePrice: DataTypes.FLOAT
    startDate: DataTypes.DATE
    endDate: DataTypes.DATE
    type: {
      type: DataTypes.STRING
    }

  }, classMethods: associate: (models) ->
    AdditionalPurchase.belongsToMany(models.ProductGm, {through: 'AdditionalPurchaseProductGm'});
    return
  )
  return AdditionalPurchase
