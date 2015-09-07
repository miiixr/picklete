
module.exports = (sequelize, DataTypes) ->
  OfferCode = sequelize.define('OfferCode', {
    token: DataTypes.STRING
    type: DataTypes.STRING #金額 or 折扣
    name: DataTypes.STRING
    discount: DataTypes.FLOAT
    activePrice: DataTypes.FLOAT
    startDate: DataTypes.DATE
    endDate: DataTypes.DATE
  }, classMethods: associate: (models) ->
    OfferCode.hasOne models.Product
    return
  )
  return OfferCode
