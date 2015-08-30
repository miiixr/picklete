
module.exports = function(sequelize, DataTypes) {

  var Dpt = sequelize.define('Dpt', {

    // 大館別名稱
    name: DataTypes.STRING,

    // 大館別權重
    weight: DataTypes.INTEGER,

    // 預設官方大館別，不能被修改與刪除
    official: DataTypes.BOOLEAN
  }, {
    classMethods: {
      associate: function(models) {
        return Dpt.hasMany(models.DptSub);
      }
    }
  });

  return Dpt;
};