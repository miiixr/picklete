
module.exports = (sequelize, DataTypes) ->
  Order = sequelize.define('Order', {
    serialNumber: DataTypes.STRING
    quantity: DataTypes.INTEGER
    paymentTotalAmount: DataTypes.FLOAT
    paymentIsConfirmed: DataTypes.BOOLEAN
    paymentConfirmDate: DataTypes.DATE
    paymentConfirmName: DataTypes.STRING
    paymentConfirmPostfix: DataTypes.STRING
    paymentConfirmAmount: DataTypes.FLOAT
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
