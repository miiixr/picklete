
module.exports = (sequelize, DataTypes) ->
  TopicActive = sequelize.define('TopicActive', {
    title: DataTypes.STRING
    weight: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, classMethods: associate: (models) ->
    TopicActive.belongsTo models.Image, {foreignKey : 'ImageAId'}
    TopicActive.belongsTo models.Image, {foreignKey : 'ImageA1Id'}
    TopicActive.belongsTo models.Image, {foreignKey : 'ImageA2Id'}

    TopicActive.belongsTo models.Image, {foreignKey : 'ImageBId'}
    TopicActive.belongsTo models.Image, {foreignKey : 'ImageB1Id'}
    TopicActive.belongsTo models.Image, {foreignKey : 'ImageB2Id'}

    TopicActive.belongsTo models.Image, {foreignKey : 'ImageCId'}
    TopicActive.belongsTo models.Image, {foreignKey : 'ImageC1Id'}
    TopicActive.belongsTo models.Image, {foreignKey : 'ImageC2Id'}
    return
  )
  return TopicActive
