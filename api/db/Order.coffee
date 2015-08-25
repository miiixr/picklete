
module.exports = (sequelize, DataTypes) ->
  Order = sequelize.define('Order', {
    serialNumber: DataTypes.STRING
    quantity: DataTypes.INTEGER
  }, classMethods: associate: (models) ->
    Order.belongsTo models.User
    Order.hasMany models.OrderItem
    Order.hasOne models.Shipment
    return
  )
  return Order
