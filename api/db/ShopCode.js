module.exports = function(sequelize, DataTypes) {

  var ShopCode = sequelize.define('ShopCode', {

    // 優惠代碼
    code: DataTypes.STRING,
    // 優惠名稱
    title: DataTypes.STRING,
    // 優惠類型: price, discount
    type: DataTypes.ENUM(
      'price',
      'discount'
    ),
    // 優惠內容
    description: DataTypes.FLOAT,

    // 限滿額
    restriction: DataTypes.INTEGER,

    // 優惠起始/結束時間
    startDate: DataTypes.DATEONLY,
    endDate: DataTypes.DATEONLY,
    restrictionDate: {
      type: DataTypes.STRING,
      defaultValue: 'off'
    },

    // 自動發送: 0: all, 1: specific, 2: beginner
    sentType: DataTypes.ENUM(
      'all',
      'specific',
      'beginner',
      'none'
    ),

    // 發送內容
    sentContent: DataTypes.TEXT

  }, {
    classMethods: {
      associate: (models) => {
        ShopCode.hasMany(models.User);
        ShopCode.hasMany(models.Order);
      }
    }
  });

  return ShopCode;
};
