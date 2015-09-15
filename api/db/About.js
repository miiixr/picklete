
module.exports = function(sequelize, DataTypes) {

  var About = sequelize.define('About', {

    //品牌願景
    brandVision: DataTypes.TEXT,
    //產品圖片
    productPhotos: {
      type: DataTypes.TEXT,
      get: function() {

        var value = this.getDataValue('productPhotos');

        if(value) {
          return JSON.parse(value);
        }

        return [];
      },
      set: function(value) {
        return this.setDataValue('productPhotos', JSON.stringify(value));
      }
    },
    //公司簡介
    aboutCompany: DataTypes.TEXT,
    //經銷商（圖片跟URL)
    dealerPhotos: {
      type: DataTypes.TEXT,
      get: function() {

        var value = this.getDataValue('dealerPhotos');

        if(value) {
          return JSON.parse(value);
        }

        return [];
      },
      set: function(value) {
        return this.setDataValue('dealerPhotos', JSON.stringify(value));
      }
    },
    dealerNames: {
      type: DataTypes.TEXT,
      get: function() {

        var value = this.getDataValue('dealerNames');

        if(value) {
          return JSON.parse(value);
        }

        return [];
      },
      set: function(value) {
        return this.setDataValue('dealerNames', JSON.stringify(value));
      }
    }
  });

  return About;
};
