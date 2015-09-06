
module.exports = (sequelize, DataTypes) ->
  Promotion = sequelize.define('Promotion', {
    title: DataTypes.STRING
    description: DataTypes.STRING
    startDate: DataTypes.DATE
    endDate: DataTypes.DATE
    discount: DataTypes.FLOAT
  }, classMethods: associate: (models) ->
    Promotion.hasMany models.Product
    return
  )
  return Promotion
