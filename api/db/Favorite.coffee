
module.exports = (sequelize, DataTypes) ->
  Favorite = sequelize.define('Favorite', {
    productId: DataTypes.INTEGER,
    productGmId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER,
  }, classMethods: associate: (models) ->
    return
  )
  
  return Favorite
