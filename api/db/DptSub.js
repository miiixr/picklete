
module.exports = function(sequelize, DataTypes) {

  var DptSub = sequelize.define('DptSub', {

    // 小館別名稱
    name: DataTypes.STRING,

    // 小館別權重
    weight: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },

    // 預設官方小館別，不能被修改與刪除
    official: DataTypes.BOOLEAN
  }, {
    classMethods: {
      associate: function(models) {
        DptSub.belongsTo(models.Dpt);
        DptSub.belongsToMany(models.ProductGm, {through: 'DptSubProductGm'});

        return
      }
    }
  });

  return DptSub;
};
