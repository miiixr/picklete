
module.exports = (sequelize, DataTypes) ->
  OrderItem = sequelize.define 'OrderItem', {
    name: DataTypes.STRING
    description: DataTypes.STRING
    quantity: DataTypes.INTEGER
    price: DataTypes.INTEGER
    comment: DataTypes.STRING
    spec: DataTypes.STRING
  }, classMethods: associate: (models) ->
    OrderItem.belongsTo models.Order
    OrderItem.belongsTo models.Product
    return

  return OrderItem
