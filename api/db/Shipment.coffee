module.exports = (sequelize, DataTypes) ->
  Shipment = sequelize.define('Shipment', {
    username: DataTypes.STRING
    mobile: DataTypes.STRING
    taxId: DataTypes.STRING
    email: DataTypes.STRING
    address: DataTypes.STRING
  }, classMethods: associate: (models) ->
    Shipment.belongsTo models.Order
    return
  )
  return Shipment
