
module.exports = (sequelize, DataTypes) ->
  Favorite = sequelize.define('Favorite', {
  }, classMethods: associate: (models) ->
    Favorite.belongsToMany(models.User, {through: 'FavoriteProduct'})
    return
  )

  return Favorite
