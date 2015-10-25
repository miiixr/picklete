
module.exports = (sequelize, DataTypes) ->
  Promotion = sequelize.define('Promotion', {
    title: DataTypes.STRING
    slogan: DataTypes.STRING
    createDpt: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
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
