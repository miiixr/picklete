module.exports = (sequelize, DataTypes) ->
  LikesCount = sequelize.define('LikesCount', {
    productGmLikesCount: DataTypes.INTEGER,
    productGmId: DataTypes.INTEGER
  }, classMethods: associate: (models) ->
    return
  )
  
  return LikesCount
