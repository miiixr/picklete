
module.exports = (sequelize, DataTypes) ->
  BonusPoint = sequelize.define('BonusPoint', {
    remain: DataTypes.INTEGER
    used: DataTypes.INTEGER
    email: {type: DataTypes.STRING, unique: true}
  }, classMethods: associate: (models) ->
    return
  )
  return BonusPoint
