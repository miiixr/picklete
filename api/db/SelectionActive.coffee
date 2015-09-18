
module.exports = (sequelize, DataTypes) ->
  SelectionActive = sequelize.define('SelectionActive', {
    type: DataTypes.ENUM('oneLong', 'oneBig', 'two', 'three')
    weight: DataTypes.INTEGER
  }, classMethods: associate: (models) ->
    SelectionActive.hasMany models.Image
    return
  )
  return SelectionActive
