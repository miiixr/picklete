
module.exports = function(sequelize, DataTypes) {

  var Dpt_Sub = sequelize.define('Dpt_Sub', {

    // 小館別名稱
    name: DataTypes.STRING,

    // 小館別權重
    weight: DataTypes.INTEGER,

    // 預設官方小館別，不能被修改與刪除
    official: DataTypes.BOOLEAN
  }, {
    classMethods: {
      associate: function(models) {
          return Dpt_Sub.belongsTo(models.Dpt);
      }
    }
  });

  return Dpt_Sub;
};