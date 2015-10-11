module.exports = (sequelize, DataTypes) ->
  Shipment = sequelize.define('Shipment', {
    username: DataTypes.STRING
    mobile: DataTypes.STRING
    taxId: DataTypes.STRING
    email: DataTypes.STRING
    address: DataTypes.STRING
    shippingType: {
      type: DataTypes.ENUM('postoffice', 'delivery'),
      defaultValue: 'postoffice'

    }
    shippingRegion: DataTypes.STRING
    shippingFee: DataTypes.FLOAT
    shippingId: DataTypes.STRING

  }, classMethods: associate: (models) ->
    Shipment.belongsTo models.Order
    return
  )
  return Shipment
