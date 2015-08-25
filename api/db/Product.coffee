
module.exports = (sequelize, DataTypes) ->
  Product = sequelize.define 'Product', {
    name: DataTypes.STRING
    description: DataTypes.STRING
    stockQuantity: DataTypes.INTEGER
    price: DataTypes.INTEGER
    isPublish: DataTypes.BOOLEAN
    comment: DataTypes.STRING
    spec: DataTypes.STRING
  }, classMethods: associate: (models) ->
    return

  return Product
