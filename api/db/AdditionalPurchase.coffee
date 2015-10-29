
module.exports = (sequelize, DataTypes) ->
  AdditionalPurchase = sequelize.define('AdditionalPurchase', {
    name: DataTypes.STRING
    discount: DataTypes.FLOAT
    reducePrice: DataTypes.FLOAT
    startDate: DataTypes.DATE
    endDate: DataTypes.DATE
    anyTime: DataTypes.BOOLEAN
    activityLimit: {
      type: DataTypes.INTEGER
      defaultValue: 0
    }
    type: DataTypes.ENUM(
      'reduce',
      'discount'
    )
  }, classMethods: associate: (models) ->
    AdditionalPurchase.belongsToMany models.Product, through: 'AdditionalPurchaseProduct'
    return
  )
  return AdditionalPurchase
