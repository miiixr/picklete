
module.exports = function(sequelize, DataTypes) {

  var Like = sequelize.define('Like', {
    title: DataTypes.STRING,
  }, {
    classMethods: {
      associate: function(models) {
        Like.belongsToMany(models.User, {through: 'UserLike'});
        return
      }
    }
  });

  return Like;
};
