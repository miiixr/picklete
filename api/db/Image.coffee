
module.exports = (sequelize, DataTypes) ->
  Image = sequelize.define('Image', {
    type: DataTypes.ENUM('1100X160', '1100X350', '545X350', '360X240')
    link: DataTypes.STRING
    path: DataTypes.STRING


  }, classMethods: associate: (models) ->
    return
  )
  return Image
