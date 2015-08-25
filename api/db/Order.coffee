
module.exports = (sequelize, DataTypes) ->
  Order = sequelize.define('Order', {
    serialNumber: DataTypes.STRING
    quantity: DataTypes.INTEGER
    status:
      type: DataTypes.ENUM('new', 'paymentConfirm', 'deliveryConfirm')
      defaultValue: 'new'

  }, classMethods: associate: (models) ->
    Order.belongsTo models.User
    Order.hasMany models.OrderItem
    Order.hasOne models.Shipment
    return
  )
  return Order
