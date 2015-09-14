module.exports = function(sequelize, DataTypes) {

  var Slider = sequelize.define('Slider', {

    // 活動主圖
    cover: DataTypes.STRING,

    // 活動標題
    title: DataTypes.STRING,

    // 品牌介紹
    description: DataTypes.TEXT,

    // 文案位置
    location: DataTypes.STRING,

    // 文案顏色
    color: DataTypes.STRING,

    // 活動網址
    link: DataTypes.STRING

  });

  return Slider;
};