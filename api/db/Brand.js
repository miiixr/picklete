
module.exports = function(sequelize, DataTypes) {

  var Brand = sequelize.define('Brand', {

    // 品牌大頭照
    avatar: DataTypes.STRING,

    // 品牌名稱
    name: DataTypes.STRING,

    // 代理商品 or 精選商品
    type: DataTypes.ENUM('AGENT', 'PRIME_GOOD', 'OTHER'),

    // 品牌介紹
    desc: DataTypes.TEXT,

    // 購物招牌
    banner: DataTypes.STRING,

    // 形象照片
    photos: {
      type: DataTypes.TEXT,
      get: function() {

        var value = this.getDataValue('photos');

        if(value) {
          return JSON.parse(value);
        }

        return [];
      },
      set: function(value) {
        return this.setDataValue('photos', JSON.stringify(value));
      }
    },

    // 順序權重
    weight: {
      type: DataTypes.INTEGER,
    }
  });

  return Brand;
};
