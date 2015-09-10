
module.exports = (sequelize, DataTypes) ->
  TopicActive = sequelize.define('TopicActive', {
    title: DataTypes.STRING
  }, classMethods: associate: (models) ->
    TopicActive.belongsTo models.Image, {as: 'ImageAId', foreignKey : 'ImageAId'}
    TopicActive.belongsTo models.Image, {as: 'ImageA1Id', foreignKey : 'ImageA1Id'}
    TopicActive.belongsTo models.Image, {as: 'ImageA2Id', foreignKey : 'ImageA2Id'}

    TopicActive.belongsTo models.Image, {as: 'ImageBId', foreignKey : 'ImageBId'}
    TopicActive.belongsTo models.Image, {as: 'ImageB1Id', foreignKey : 'ImageB1Id'}
    TopicActive.belongsTo models.Image, {as: 'ImageB2Id', foreignKey : 'ImageB2Id'}

    TopicActive.belongsTo models.Image, {as: 'ImageCId', foreignKey : 'ImageCId'}
    TopicActive.belongsTo models.Image, {as: 'ImageC1Id', foreignKey : 'ImageC1Id'}
    TopicActive.belongsTo models.Image, {as: 'ImageC2Id', foreignKey : 'ImageC2Id'}
    return
  )
  return TopicActive
