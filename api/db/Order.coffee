
module.exports = (sequelize, DataTypes) ->
  Order = sequelize.define('Order', {
    orderId: DataTypes.STRING
    quantity: DataTypes.INTEGER
  }, classMethods: associate: (models) ->
    Order.belongsTo models.User
    Order.hasOne models.Product
    Order.hasOne models.Shipment
    return
  )
  return Order
