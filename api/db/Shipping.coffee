
module.exports = (sequelize, DataTypes) ->
  Shipping = sequelize.define('Shipping', {
    # 運送方式
    type:
      type: DataTypes.ENUM('postoffice', 'delivery')
      defaultValue: 'delivery'
    # 地區
    region: DataTypes.STRING
    # 運費
    fee: DataTypes.INTEGER

  }, classMethods: associate: (models) ->

    return
  )
  return Shipping
