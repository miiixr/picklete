
module.exports = (sequelize, DataTypes) ->
  Promotion = sequelize.define('Promotion', {
    title: DataTypes.STRING
    description: DataTypes.STRING
    type: DataTypes.ENUM(
      'flash',
      'general'
    )
    discountType: DataTypes.ENUM(
      'price',
      'discount'
    )
    startDate: DataTypes.DATE
    endDate: DataTypes.DATE
    discount: DataTypes.FLOAT
    price: DataTypes.FLOAT
  }, classMethods: associate: (models) ->
    Promotion.belongsToMany models.ProductGm, through: 'PromotionProductGm'
    return
  )
  return Promotion
