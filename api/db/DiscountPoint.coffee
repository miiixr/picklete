
module.exports = (sequelize, DataTypes) ->
  DiscountPoint = sequelize.define('DiscountPoint', {
    remain: DataTypes.INTEGER
    used: DataTypes.INTEGER
    email: {type: DataTypes.STRING, unique: true}
  }, classMethods: associate: (models) ->
    return
  )
  return DiscountPoint
