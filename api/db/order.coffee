
module.exports = (sequelize, DataTypes) ->
  Order = sequelize.define('Order', {
    orderId: DataTypes.STRING
    quantity: DataTypes.INTEGER
  }, classMethods: associate: (models) ->
    Order.belongsTo models.User
    # Order.HasOne models.Product
    return
  )
  return Order
