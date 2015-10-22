module.exports = (sequelize, DataTypes) ->
  PageView = sequelize.define('PageView', {
    productGmPageView: DataTypes.INTEGER,
    productGmId: DataTypes.INTEGER
  }, classMethods: associate: (models) ->
    return
  )
  return PageView
