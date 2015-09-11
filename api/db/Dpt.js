
module.exports = function(sequelize, DataTypes) {

  var Dpt = sequelize.define('Dpt', {

    // 大館別名稱
    name: DataTypes.STRING,

    // 大館別權重
    weight: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },

    // 預設官方大館別，不能被修改與刪除
    official: DataTypes.BOOLEAN
  }, {
    classMethods: {
      associate: function(models) {
        Dpt.hasMany(models.DptSub);
        Dpt.belongsToMany(models.ProductGm, {through: 'DptProductGm'});

        return
      }
    }
  });

  return Dpt;
};
