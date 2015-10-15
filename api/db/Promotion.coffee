
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
    startDate: DataTypes.DATEONLY
    endDate: DataTypes.DATEONLY
    discount: DataTypes.FLOAT
    price: DataTypes.FLOAT
    # 照片
    coverPhoto:
      type: DataTypes.TEXT
      get: () ->
        value = this.getDataValue('coverPhoto');

        if value
          return JSON.parse(value)
        return []

      set: (value) ->
        return this.setDataValue('coverPhoto', JSON.stringify(value))
  }, classMethods: associate: (models) ->
    Promotion.belongsToMany models.Product, through: 'PromotionProduct'
    return
  )
  return Promotion
