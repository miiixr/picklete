
module.exports = (sequelize, DataTypes) ->
  OrderItem = sequelize.define 'OrderItem', {
    # order name
    name: DataTypes.STRING
    # order description
    description: DataTypes.STRING
    # order purcharse quantity
    quantity: DataTypes.INTEGER
    # order amount price
    price: DataTypes.FLOAT
    # comment / note
    comment: DataTypes.STRING
    # spec note
    spec: DataTypes.STRING
    # packing fee
    packingFee: DataTypes.FLOAT
    # 貨號
    productNumber: DataTypes.STRING

  }, classMethods: associate: (models) ->
    OrderItem.belongsTo models.Order
    OrderItem.belongsTo models.Product
    return

  return OrderItem
