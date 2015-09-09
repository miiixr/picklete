
module.exports = (sequelize, DataTypes) ->
  Image = sequelize.define('Image', {
    link: DataTypes.STRING
    path: DataTypes.STRING
    openWindow: {
      type: DataTypes.BOOLEAN
      defaultValue: false
    }
  }, classMethods: associate: (models) ->
    return
  )
  return Image
