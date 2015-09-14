
module.exports = (sequelize, DataTypes) ->
  Image = sequelize.define('Image', {
    url: DataTypes.STRING
    path: DataTypes.STRING
    openWindow: {
      type: DataTypes.BOOLEAN
      defaultValue: false
    }
  }, classMethods: associate: (models) ->
    return
  )
  return Image
