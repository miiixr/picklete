
module.exports = function(sequelize, DataTypes) {

  var Company = sequelize.define('Company', {
    
    title: DataTypes.STRING,
    // 公司圖片位置
    avatar: DataTypes.STRING,
    
    // 公司名稱
    name: DataTypes.STRING,

    // 公司完整名稱
    fullname: DataTypes.STRING,

    // 公司聯絡 email
    email: DataTypes.STRING,

    // 公司介紹
    desc: DataTypes.TEXT,

    // 公司 blog 網址
    blog: DataTypes.STRING,

    // 公司的 line image
    line: DataTypes.STRING,
    // facebook url
    facebook: DataTypes.STRING,
    // instagram url
    instagram: DataTypes.STRING,
    // youtube url
    youtube: DataTypes.STRING
  });

  return Company;
};