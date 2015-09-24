module.exports = function(sequelize, DataTypes) {

  var ShopCode = sequelize.define('ShopCode', {

    // 優惠代碼
    code: DataTypes.STRING,
    // 優惠名稱
    title: DataTypes.STRING,
    // 優惠類型
    type: DataTypes.ENUM(
      'price',
      'discount'
    ),
    // 優惠內容
    description: DataTypes.FLOAT,

    // 限滿額
    restriction: DataTypes.INTEGER,

    // 優惠起始/結束時間
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE,

    // 自動發送
    sent: DataTypes.BOOLEAN,

    // 發送內容
    content: DataTypes.TEXT

  });

  return ShopCode;
};

