
module.exports = (sequelize, DataTypes) ->
  Product = sequelize.define 'Product', {
    name: DataTypes.STRING
    descript: DataTypes.STRING
    stockQuantity: DataTypes.INTEGER
    price: DataTypes.INTEGER
  }, classMethods: associate: (models) ->
    Product.hasOne models.Order
    return

  return Product
