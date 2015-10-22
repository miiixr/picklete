module.exports = (sequelize, DataTypes) ->
  PageView = sequelize.define('PageView', {
    pageView: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    }
  }, classMethods: associate: (models) ->
    PageView.hasOne(models.ProductGm)
    return
  )
  return PageView
